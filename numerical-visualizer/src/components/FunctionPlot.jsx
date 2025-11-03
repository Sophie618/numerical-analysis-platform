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

    // Tooltip
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

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

    // Clip path to prevent drawing outside bounds
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    // Create a group for zoomable content
    const zoomGroup = g.append('g')
      .attr('clip-path', 'url(#clip)');

    // Grid
    const xAxisGrid = g.append('g')
      .attr('class', 'grid x-grid')
      .attr('opacity', 0.08)
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(''));

    const yAxisGrid = g.append('g')
      .attr('class', 'grid y-grid')
      .attr('opacity', 0.08)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(''));

    // Axes
    const xAxisGroup = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));
    
    xAxisGroup.selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    const yAxisGroup = g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));
    
    yAxisGroup.selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // Zero line
    if (yMin < 0 && yMax > 0) {
      zoomGroup.append('line')
        .attr('class', 'zero-line')
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

    zoomGroup.append('path')
      .attr('class', 'function-curve')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', '#006C39')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 3)
      .attr('d', line);

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
        
        zoomGroup.append('circle')
          .datum({ x, y: fx })
          .attr('class', 'iteration-point')
          .attr('cx', xScale(x))
          .attr('cy', yScale(fx))
          .attr('r', isActive ? 8 : 5)
          .attr('fill', isActive ? '#ec4899' : '#3b82f6')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('opacity', isActive ? 1 : 0.6)
          .style('cursor', 'pointer')
          .on('mouseover', function() {
            d3.select(this).attr('r', isActive ? 10 : 7);
            tooltip
              .style('visibility', 'visible')
              .html(`<div>x: ${x.toFixed(6)}</div><div>y: ${fx.toFixed(6)}</div><div>迭代: ${index + 1}</div>`);
          })
          .on('mousemove', function(event) {
            tooltip
              .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
              .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
          })
          .on('mouseout', function() {
            d3.select(this).attr('r', isActive ? 8 : 5);
            tooltip.style('visibility', 'hidden');
          });

        if (isActive) {
          zoomGroup.append('text')
            .datum({ x, y: fx })
            .attr('class', 'active-label')
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
          zoomGroup.append('line')
            .datum({ x0, y0, xIntercept })
            .attr('class', 'tangent-line')
            .attr('x1', xScale(x0))
            .attr('y1', yScale(y0))
            .attr('x2', xScale(xIntercept))
            .attr('y2', yScale(0))
            .attr('stroke', '#ec4899')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.8);
        }

        // Damping attempts visualization
        if (item.dampingAttempts && item.dampingAttempts.length > 1) {
          item.dampingAttempts.forEach((attempt, idx) => {
            const attemptX = attempt.x;
            const attemptFx = attempt.fx;
            
            if (!isFinite(attemptX) || !isFinite(attemptFx)) return;

            // Draw connection line from current point to attempt
            zoomGroup.append('line')
              .datum({ x0: item.x, y0: item.fx, x1: attemptX, y1: attemptFx })
              .attr('class', 'damping-attempt-line')
              .attr('x1', xScale(item.x))
              .attr('y1', yScale(item.fx))
              .attr('x2', xScale(attemptX))
              .attr('y2', yScale(attemptFx))
              .attr('stroke', attempt.satisfied ? '#10b981' : '#ef4444')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '3,3')
              .attr('opacity', 0.4);

            // Draw attempt point
            zoomGroup.append('circle')
              .datum({ x: attemptX, y: attemptFx })
              .attr('class', 'damping-attempt-point')
              .attr('cx', xScale(attemptX))
              .attr('cy', yScale(attemptFx))
              .attr('r', attempt.satisfied ? 4 : 3)
              .attr('fill', attempt.satisfied ? '#10b981' : '#ef4444')
              .attr('stroke', 'white')
              .attr('stroke-width', 1.5)
              .attr('opacity', attempt.satisfied ? 0.8 : 0.5)
              .style('cursor', 'pointer')
              .on('mouseover', function() {
                d3.select(this).attr('r', attempt.satisfied ? 6 : 5);
                tooltip
                  .style('visibility', 'visible')
                  .html(`
                    <div>下山尝试 ${idx + 1}</div>
                    <div>λ = ${attempt.lambda.toFixed(4)}</div>
                    <div>x = ${attemptX.toFixed(6)}</div>
                    <div>f(x) = ${attemptFx.toFixed(6)}</div>
                    <div style="color: ${attempt.satisfied ? '#10b981' : '#ef4444'}">${attempt.satisfied ? '✓ 满足下山条件' : '✗ 不满足'}</div>
                  `);
              })
              .on('mousemove', function(event) {
                tooltip
                  .style('top', (event.pageY - containerRef.current.offsetTop - 80) + 'px')
                  .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
              })
              .on('mouseout', function() {
                d3.select(this).attr('r', attempt.satisfied ? 4 : 3);
                tooltip.style('visibility', 'hidden');
              });
          });
        }
      }

      // Secant line
      if (method === 'Secant' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.secantLine) {
          const { points } = item.secantLine;
          const [[x0, y0], [x1, y1]] = points;
          zoomGroup.append('line')
            .datum({ x0, y0, x1, y1 })
            .attr('class', 'secant-line')
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
          zoomGroup.append('rect')
            .datum({ a, b })
            .attr('class', 'bisection-interval')
            .attr('x', xScale(a))
            .attr('y', 0)
            .attr('width', xScale(b) - xScale(a))
            .attr('height', innerHeight)
            .attr('fill', '#3b82f6')
            .attr('opacity', 0.1);
        }
      }
    }

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on('zoom', (event) => {
        const newXScale = event.transform.rescaleX(xScale);
        const newYScale = event.transform.rescaleY(yScale);

        // Update axes
        xAxisGroup.call(d3.axisBottom(newXScale));
        yAxisGroup.call(d3.axisLeft(newYScale));
        
        // Re-apply colors
        xAxisGroup.selectAll('text, line, path')
          .attr('stroke', '#A13F0B')
          .attr('stroke-opacity', 0.7)
          .attr('fill', '#A13F0B')
          .attr('fill-opacity', 0.7);
        
        yAxisGroup.selectAll('text, line, path')
          .attr('stroke', '#A13F0B')
          .attr('stroke-opacity', 0.7)
          .attr('fill', '#A13F0B')
          .attr('fill-opacity', 0.7);

        // Update grids
        xAxisGrid.call(d3.axisBottom(newXScale).tickSize(-innerHeight).tickFormat(''));
        yAxisGrid.call(d3.axisLeft(newYScale).tickSize(-innerWidth).tickFormat(''));

        // Update function curve
        const newLine = d3.line()
          .x(d => newXScale(d.x))
          .y(d => newYScale(d.y));
        
        zoomGroup.select('.function-curve').attr('d', newLine);

        // Update zero line
        zoomGroup.select('.zero-line')
          .attr('y1', newYScale(0))
          .attr('y2', newYScale(0));

        // Update iteration points
        zoomGroup.selectAll('.iteration-point')
          .attr('cx', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.x) : d3.select(this).attr('cx');
          })
          .attr('cy', function() {
            const data = d3.select(this).datum();
            return data ? newYScale(data.y) : d3.select(this).attr('cy');
          });

        // Update active labels
        zoomGroup.selectAll('.active-label')
          .attr('x', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.x) : d3.select(this).attr('x');
          })
          .attr('y', function() {
            const data = d3.select(this).datum();
            return data ? newYScale(data.y) - 15 : d3.select(this).attr('y');
          });

        // Update tangent line
        zoomGroup.selectAll('.tangent-line')
          .attr('x1', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.x0) : d3.select(this).attr('x1');
          })
          .attr('y1', function() {
            const data = d3.select(this).datum();
            return data ? newYScale(data.y0) : d3.select(this).attr('y1');
          })
          .attr('x2', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.xIntercept) : d3.select(this).attr('x2');
          })
          .attr('y2', newYScale(0));

        // Update secant line
        zoomGroup.selectAll('.secant-line')
          .attr('x1', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.x0) : d3.select(this).attr('x1');
          })
          .attr('y1', function() {
            const data = d3.select(this).datum();
            return data ? newYScale(data.y0) : d3.select(this).attr('y1');
          })
          .attr('x2', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.x1) : d3.select(this).attr('x2');
          })
          .attr('y2', function() {
            const data = d3.select(this).datum();
            return data ? newYScale(data.y1) : d3.select(this).attr('y2');
          });

        // Update bisection interval
        zoomGroup.selectAll('.bisection-interval')
          .attr('x', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.a) : d3.select(this).attr('x');
          })
          .attr('width', function() {
            const data = d3.select(this).datum();
            return data ? newXScale(data.b) - newXScale(data.a) : d3.select(this).attr('width');
          });
      });

    svg.call(zoom);

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [func, history, currentStep, method, xRange]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">函数曲线与迭代过程</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">🔍 滚轮缩放 | 🖱️ 拖动平移</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse-glow"></div>
            <span className="text-xs text-neutral-600">实时渲染</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[400px] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200 relative" style={{position: 'relative'}}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default FunctionPlot;
