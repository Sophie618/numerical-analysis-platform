import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ConvergenceChart({ history, currentStep }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!history || history.length === 0 || !svgRef.current || !containerRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
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

    const data = history.slice(0, currentStep + 1)
      .map(item => ({
        iteration: item.iteration,
        error: item.error,
        convergenceRate: item.convergenceRate
      }))
      .filter(d => d.error > 0 && isFinite(d.error));

    if (data.length === 0) return;

    const xScale = d3.scaleLinear()
      .domain([1, Math.max(...data.map(d => d.iteration))])
      .range([0, innerWidth]);

    const minError = Math.min(...data.map(d => d.error));
    const maxError = Math.max(...data.map(d => d.error));
    
    const yScale = d3.scaleLog()
      .domain([Math.max(minError / 10, 1e-12), maxError * 2])
      .range([innerHeight, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.08)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(10, data.length)))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d.toExponential(0)))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // Error curve
    const line = d3.line()
      .x(d => xScale(d.iteration))
      .y(d => yScale(d.error));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#gradient2)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient2')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f59e0b');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ef4444');

    // Data points
    g.selectAll('.error-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.iteration))
      .attr('cy', d => yScale(d.error))
      .attr('r', d => d.iteration === currentStep + 1 ? 7 : 4)
      .attr('fill', d => d.iteration === currentStep + 1 ? '#ec4899' : '#f59e0b')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', d => d.iteration === currentStep + 1 ? 1 : 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const isActive = d.iteration === currentStep + 1;
        d3.select(this).attr('r', isActive ? 9 : 6);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>迭代: ${d.iteration}</div><div>误差: ${d.error.toExponential(6)}</div>${d.convergenceRate ? `<div>收敛率: ${d.convergenceRate.toFixed(4)}</div>` : ''}`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        const isActive = d.iteration === currentStep + 1;
        d3.select(this).attr('r', isActive ? 7 : 4);
        tooltip.style('visibility', 'hidden');
      });

    // Current point label
    const currentData = data.find(d => d.iteration === currentStep + 1);
    if (currentData) {
      g.append('text')
        .attr('x', xScale(currentData.iteration))
        .attr('y', yScale(currentData.error) - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1e293b')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text(`ε = ${currentData.error.toExponential(2)}`);
    }

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [history, currentStep]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">收敛速度分析</h2>
      <div ref={containerRef} className="w-full h-[300px] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200 relative" style={{position: 'relative'}}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default ConvergenceChart;
