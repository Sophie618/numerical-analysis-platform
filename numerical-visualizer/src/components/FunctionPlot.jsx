import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function FunctionPlot({ func, history, currentStep, method, xRange }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!func || !svgRef.current || !containerRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let xMin, xMax;
    if (xRange) {
      xMin = xRange[0];
      xMax = xRange[1];
    } else if (history && history.length > 0) {
      const xValues = history.map(h => {
        if (method === 'Bisection') return h.x;
        if (method === 'Newton') return h.x;
        if (method === 'Aitken') return h.xHat;
        if (method === 'Secant') return h.x;
        return 0;
      });
      xMin = Math.min(...xValues) - 1;
      xMax = Math.max(...xValues) + 1;
    } else {
      xMin = -5;
      xMax = 5;
    }

    const curveData = [];
    const numPoints = 200;
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * i / numPoints;
      try {
        const y = func(x);
        if (isFinite(y) && Math.abs(y) < 1000) {
          curveData.push({ x, y });
        }
      } catch {
        // Ignore errors for invalid function evaluations
      }
    }

    const yValues = curveData.map(d => d.y);
    const yMin = Math.min(...yValues, 0) * 1.1;
    const yMax = Math.max(...yValues, 0) * 1.1;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.08)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(''));

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.08)
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text, line, path')
      .attr('stroke', '#94a3b8')
      .attr('fill', '#94a3b8');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text, line, path')
      .attr('stroke', '#94a3b8')
      .attr('fill', '#94a3b8');

    // Zero line
    if (yMin < 0 && yMax > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }

    // Function curve
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    g.append('path')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#gradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 1);

    // Iteration points
    if (history && history.length > 0 && currentStep >= 0) {
      const currentHistory = history.slice(0, currentStep + 1);

      currentHistory.forEach((item, index) => {
        let x, fx;
        if (method === 'Bisection') {
          x = item.x;
          fx = item.fx;
        } else if (method === 'Newton') {
          x = item.x;
          fx = item.fx;
        } else if (method === 'Aitken') {
          x = item.xHat;
          fx = func ? func(x) : 0;
        } else if (method === 'Secant') {
          x = item.x;
          fx = item.fx;
        }

        if (!isFinite(x) || !isFinite(fx)) return;

        const isActive = index === currentStep;
        
        g.append('circle')
          .attr('cx', xScale(x))
          .attr('cy', yScale(fx))
          .attr('r', isActive ? 8 : 5)
          .attr('fill', isActive ? '#ec4899' : '#3b82f6')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('opacity', isActive ? 1 : 0.6);

        if (isActive) {
          g.append('text')
            .attr('x', xScale(x))
            .attr('y', yScale(fx) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#1e293b')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`(${x.toFixed(4)}, ${fx.toFixed(4)})`);
        }
      });

      // Tangent line for Newton
      if (method === 'Newton' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.tangentLine) {
          const { point, xIntercept } = item.tangentLine;
          const [x0, y0] = point;
          g.append('line')
            .attr('x1', xScale(x0))
            .attr('y1', yScale(y0))
            .attr('x2', xScale(xIntercept))
            .attr('y2', yScale(0))
            .attr('stroke', '#ec4899')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.8);
        }
      }

      // Secant line
      if (method === 'Secant' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.secantLine) {
          const { points } = item.secantLine;
          const [[x0, y0], [x1, y1]] = points;
          g.append('line')
            .attr('x1', xScale(x0))
            .attr('y1', yScale(y0))
            .attr('x2', xScale(x1))
            .attr('y2', yScale(y1))
            .attr('stroke', '#ec4899')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.8);
        }
      }

      // Bisection interval
      if (method === 'Bisection' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.interval) {
          const [a, b] = item.interval;
          g.append('rect')
            .attr('x', xScale(a))
            .attr('y', 0)
            .attr('width', xScale(b) - xScale(a))
            .attr('height', innerHeight)
            .attr('fill', '#3b82f6')
            .attr('opacity', 0.1);
        }
      }
    }
  }, [func, history, currentStep, method, xRange]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">函数曲线与迭代过程</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse-glow"></div>
          <span className="text-xs text-neutral-600">实时渲染</span>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[400px] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default FunctionPlot;
