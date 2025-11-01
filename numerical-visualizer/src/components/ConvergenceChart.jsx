import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ConvergenceChart.css';

/**
 * 收敛速度分析图表组件
 * 使用对数坐标显示误差下降
 */
function ConvergenceChart({ history, currentStep }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!history || history.length === 0 || !svgRef.current || !containerRef.current) return;

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 准备数据 - 只显示到当前步骤
    const data = history.slice(0, currentStep + 1)
      .map(item => ({
        iteration: item.iteration,
        error: item.error,
        convergenceRate: item.convergenceRate
      }))
      .filter(d => d.error > 0 && isFinite(d.error)); // 过滤掉无效数据

    if (data.length === 0) return;

    // 创建比例尺
    const xScale = d3.scaleLinear()
      .domain([1, Math.max(...data.map(d => d.iteration))])
      .range([0, innerWidth]);

    // 使用对数比例尺
    const minError = Math.min(...data.map(d => d.error));
    const maxError = Math.max(...data.map(d => d.error));
    
    const yScale = d3.scaleLog()
      .domain([
        Math.max(minError / 10, 1e-12),
        maxError * 2
      ])
      .range([innerHeight, 0]);

    // 绘制网格线
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(''));

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat(''));

    // 绘制坐标轴
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(10, data.length)))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('迭代次数');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => d.toExponential(0)))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -55)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('误差（对数）');

    // 绘制误差曲线
    const line = d3.line()
      .x(d => xScale(d.iteration))
      .y(d => yScale(d.error));

    g.append('path')
      .datum(data)
      .attr('class', 'error-curve')
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // 绘制数据点
    g.selectAll('.error-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'error-point')
      .attr('cx', d => xScale(d.iteration))
      .attr('cy', d => yScale(d.error))
      .attr('r', d => d.iteration === currentStep + 1 ? 7 : 4)
      .attr('fill', d => d.iteration === currentStep + 1 ? 'var(--accent-secondary)' : 'var(--accent-primary)')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', d => d.iteration === currentStep + 1 ? 1 : 0.7);

    // 添加当前点的标签
    const currentData = data.find(d => d.iteration === currentStep + 1);
    if (currentData) {
      g.append('text')
        .attr('x', xScale(currentData.iteration))
        .attr('y', yScale(currentData.error) - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-primary)')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text(`ε = ${currentData.error.toExponential(2)}`);
    }

    // 如果有足够的数据，绘制收敛率参考线
    if (data.length >= 3) {
      const lastData = data[data.length - 1];
      const firstData = data[0];
      
      // 线性收敛参考线
      const linearSlope = Math.log(lastData.error / firstData.error) / (lastData.iteration - firstData.iteration);
      
      const linearRef = data.map(d => ({
        iteration: d.iteration,
        error: firstData.error * Math.exp(linearSlope * (d.iteration - firstData.iteration))
      }));

      const linearLine = d3.line()
        .x(d => xScale(d.iteration))
        .y(d => yScale(d.error));

      g.append('path')
        .datum(linearRef)
        .attr('class', 'reference-line')
        .attr('fill', 'none')
        .attr('stroke', 'var(--text-tertiary)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.4)
        .attr('d', linearLine);

      // 添加图例
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${innerWidth - 150}, 10)`);

      legend.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', 'var(--accent-primary)')
        .attr('stroke-width', 3);

      legend.append('text')
        .attr('x', 35)
        .attr('y', 5)
        .attr('fill', 'var(--text-secondary)')
        .style('font-size', '12px')
        .text('实际误差');

      legend.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', 'var(--text-tertiary)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.4);

      legend.append('text')
        .attr('x', 35)
        .attr('y', 25)
        .attr('fill', 'var(--text-secondary)')
        .style('font-size', '12px')
        .text('线性参考');
    }

  }, [history, currentStep]);

  return (
    <div className="chart-container convergence-chart-container">
      <div className="chart-title">收敛速度分析</div>
      <div className="chart-content" ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default ConvergenceChart;

