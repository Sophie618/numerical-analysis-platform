import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './FunctionPlot.css';

/**
 * 函数绘图组件
 * 使用 D3.js 绘制函数曲线和迭代过程
 */
function FunctionPlot({ func, history, currentStep, method, xRange }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!func || !svgRef.current || !containerRef.current) return;

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 确定 x 轴范围
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

    // 生成函数曲线数据
    const curveData = [];
    const numPoints = 200;
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + (xMax - xMin) * i / numPoints;
      try {
        const y = func(x);
        if (isFinite(y) && Math.abs(y) < 1000) {
          curveData.push({ x, y });
        }
      } catch (err) {
        // 跳过计算错误的点
      }
    }

    // 确定 y 轴范围
    const yValues = curveData.map(d => d.y);
    const yMin = Math.min(...yValues, 0) * 1.1;
    const yMax = Math.max(...yValues, 0) * 1.1;

    // 创建比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
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
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('x');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('f(x)');

    // 绘制 x 轴（y=0）
    if (yMin < 0 && yMax > 0) {
      g.append('line')
        .attr('class', 'zero-line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', 'var(--text-tertiary)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }

    // 绘制函数曲线
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    g.append('path')
      .datum(curveData)
      .attr('class', 'function-curve')
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // 绘制迭代过程
    if (history && history.length > 0 && currentStep >= 0) {
      const currentHistory = history.slice(0, currentStep + 1);

      // 绘制迭代点
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
        
        // 绘制点
        g.append('circle')
          .attr('cx', xScale(x))
          .attr('cy', yScale(fx))
          .attr('r', isActive ? 8 : 5)
          .attr('fill', isActive ? 'var(--accent-secondary)' : 'var(--accent-primary)')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('opacity', isActive ? 1 : 0.6);

        // 添加标签
        if (isActive) {
          g.append('text')
            .attr('x', xScale(x))
            .attr('y', yScale(fx) - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--text-primary)')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`(${x.toFixed(4)}, ${fx.toFixed(4)})`);
        }
      });

      // 绘制切线（牛顿法）
      if (method === 'Newton' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.tangentLine) {
          const { point, slope, xIntercept } = item.tangentLine;
          const [x0, y0] = point;
          
          // 切线延伸范围
          const x1 = xIntercept;
          const y1 = 0;
          
          g.append('line')
            .attr('class', 'tangent-line')
            .attr('x1', xScale(x0))
            .attr('y1', yScale(y0))
            .attr('x2', xScale(x1))
            .attr('y2', yScale(y1))
            .attr('stroke', 'var(--accent-secondary)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.8);
        }
      }

      // 绘制割线（弦截法）
      if (method === 'Secant' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.secantLine) {
          const { points } = item.secantLine;
          const [[x0, y0], [x1, y1]] = points;
          
          g.append('line')
            .attr('class', 'secant-line')
            .attr('x1', xScale(x0))
            .attr('y1', yScale(y0))
            .attr('x2', xScale(x1))
            .attr('y2', yScale(y1))
            .attr('stroke', 'var(--accent-secondary)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.8);
        }
      }

      // 二分法区间可视化
      if (method === 'Bisection' && currentStep < history.length) {
        const item = history[currentStep];
        if (item.interval) {
          const [a, b] = item.interval;
          
          g.append('rect')
            .attr('x', xScale(a))
            .attr('y', 0)
            .attr('width', xScale(b) - xScale(a))
            .attr('height', innerHeight)
            .attr('fill', 'var(--accent-primary)')
            .attr('opacity', 0.1);
        }
      }
    }

  }, [func, history, currentStep, method, xRange]);

  return (
    <div className="chart-container function-plot-container">
      <div className="chart-title">
        <span className="status-indicator"></span>
        函数曲线与迭代过程
      </div>
      <div className="chart-content" ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default FunctionPlot;

