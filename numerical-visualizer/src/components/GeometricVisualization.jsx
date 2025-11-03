import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function GeometricVisualization({ method, history, currentStep, func, df }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!history || history.length === 0 || currentStep < 0 || !svgRef.current || !containerRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
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

    const item = history[currentStep];

    // 根据不同算法绘制不同的几何意义图
    if (method === 'Newton') {
      drawNewtonGeometry(g, item, func, df, innerWidth, innerHeight, tooltip, containerRef);
    } else if (method === 'Aitken') {
      drawAitkenGeometry(g, item, history, currentStep, innerWidth, innerHeight, tooltip, containerRef);
    } else if (method === 'Secant') {
      drawSecantGeometry(g, item, func, innerWidth, innerHeight, tooltip, containerRef);
    } else if (method === 'Bisection') {
      drawBisectionGeometry(g, item, func, innerWidth, innerHeight, tooltip, containerRef);
    }

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [method, history, currentStep, func, df]);

  // 牛顿法：切线与x轴交点
  function drawNewtonGeometry(g, item, func, df, width, height, tooltip, containerRef) {
    if (!item || !func || !df) return;

    const x = item.x;
    const fx = item.fx;
    const xNext = item.xNext;

    // 设置坐标范围
    const xRange = Math.abs(xNext - x) * 3 || 2;
    const xMin = Math.min(x, xNext) - xRange;
    const xMax = Math.max(x, xNext) + xRange;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
    
    // 计算y轴范围
    const yValues = [];
    for (let i = 0; i <= 50; i++) {
      const testX = xMin + (xMax - xMin) * i / 50;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) yValues.push(y);
      } catch (e) {}
    }
    yValues.push(fx);
    
    const yMin = Math.min(...yValues, 0) * 1.2;
    const yMax = Math.max(...yValues, 0) * 1.2;
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    // 绘制坐标轴
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // 绘制x轴
    if (yMin < 0 && yMax > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);
    }

    // 绘制函数曲线
    const curveData = [];
    for (let i = 0; i <= 100; i++) {
      const testX = xMin + (xMax - xMin) * i / 100;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) {
          curveData.push({ x: testX, y });
        }
      } catch (e) {}
    }

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    g.append('path')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', '#006C39')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // 绘制切线
    const slope = df ? df(x) : (func(x + 0.001) - func(x - 0.001)) / 0.002;
    const tangentY1 = fx + slope * (xMin - x);
    const tangentY2 = fx + slope * (xMax - x);

    g.append('line')
      .attr('x1', xScale(xMin))
      .attr('y1', yScale(tangentY1))
      .attr('x2', xScale(xMax))
      .attr('y2', yScale(tangentY2))
      .attr('stroke', '#ec4899')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.8);

    // 绘制点 (x_n, f(x_n))
    g.append('circle')
      .attr('cx', xScale(x))
      .attr('cy', yScale(fx))
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 8);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>xₙ: ${x.toFixed(6)}</div><div>f(xₙ): ${fx.toFixed(6)}</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(x))
      .attr('y', yScale(fx) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text(`(xₙ, f(xₙ))`);

    // 绘制点 x_{n+1}
    g.append('circle')
      .attr('cx', xScale(xNext))
      .attr('cy', yScale(0))
      .attr('r', 6)
      .attr('fill', '#ec4899')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 8);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>xₙ₊₁: ${xNext.toFixed(6)}</div><div>y: 0</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(xNext))
      .attr('y', yScale(0) + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('xₙ₊₁');

    // 绘制垂直虚线
    g.append('line')
      .attr('x1', xScale(x))
      .attr('y1', yScale(fx))
      .attr('x2', xScale(x))
      .attr('y2', yScale(0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.5);

    g.append('line')
      .attr('x1', xScale(xNext))
      .attr('y1', yScale(0))
      .attr('x2', xScale(xNext))
      .attr('y2', height)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.5);
  }

  // 埃特肯法：迭代函数 y=φ(x) 和 y=x 的交点
  function drawAitkenGeometry(g, item, history, currentStep, width, height, tooltip, containerRef) {
    if (!item || currentStep < 0) return;

    const x0 = item.x;
    const x1 = item.x1 || x0;
    const x2 = item.x2 || x1;
    const xHat = item.xHat;

    // 从历史数据构建迭代函数的近似曲线
    const iterationPoints = [];
    for (let i = 0; i <= currentStep && i < history.length; i++) {
      const h = history[i];
      if (h.x !== undefined && h.x1 !== undefined) {
        iterationPoints.push({ x: h.x, y: h.x1 });
      }
      if (h.x1 !== undefined && h.x2 !== undefined) {
        iterationPoints.push({ x: h.x1, y: h.x2 });
      }
    }

    const xMin = Math.min(x0, x1, x2, xHat) - 0.5;
    const xMax = Math.max(x0, x1, x2, xHat) + 0.5;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
    const yScale = d3.scaleLinear().domain([xMin, xMax]).range([height, 0]);

    // 坐标轴
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // 绘制 y=x 直线
    g.append('line')
      .attr('x1', xScale(xMin))
      .attr('y1', yScale(xMin))
      .attr('x2', xScale(xMax))
      .attr('y2', yScale(xMax))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', width - 30)
      .attr('y', 20)
      .attr('fill', '#64748b')
      .style('font-size', '12px')
      .text('y=x');

    // 绘制迭代点的连线来表示 y=φ(x) 的行为
    if (iterationPoints.length > 0) {
      // 用曲线连接迭代点
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveCatmullRom.alpha(0.5));

      g.append('path')
        .datum(iterationPoints)
        .attr('fill', 'none')
        .attr('stroke', '#006C39')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // 绘制迭代点
      iterationPoints.forEach(pt => {
        g.append('circle')
          .attr('cx', xScale(pt.x))
          .attr('cy', yScale(pt.y))
          .attr('r', 2)
          .attr('fill', '#006C39')
          .attr('opacity', 0.4);
      });
    }

    g.append('text')
      .attr('x', width - 40)
      .attr('y', height / 2)
      .attr('fill', '#006C39')
      .style('font-size', '12px')
      .text('y=φ(x)');

    // 绘制迭代过程的蛛网图
    const iterSequence = [x0, x1, x2];
    
    for (let i = 0; i < iterSequence.length - 1; i++) {
      const x = iterSequence[i];
      const xNext = iterSequence[i + 1];
      
      if (!isFinite(x) || !isFinite(xNext)) continue;

      // 竖线: (x, x) -> (x, xNext)
      g.append('line')
        .attr('x1', xScale(x))
        .attr('y1', yScale(x))
        .attr('x2', xScale(x))
        .attr('y2', yScale(xNext))
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.6);

      // 横线: (x, xNext) -> (xNext, xNext)
      g.append('line')
        .attr('x1', xScale(x))
        .attr('y1', yScale(xNext))
        .attr('x2', xScale(xNext))
        .attr('y2', yScale(xNext))
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.6);

      // 在迭代曲线上的点
      g.append('circle')
        .attr('cx', xScale(x))
        .attr('cy', yScale(xNext))
        .attr('r', 4)
        .attr('fill', '#3b82f6')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('r', 6);
          tooltip
            .style('visibility', 'visible')
            .html(`<div>x: ${x.toFixed(6)}</div><div>φ(x): ${xNext.toFixed(6)}</div>`);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
            .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4);
          tooltip.style('visibility', 'hidden');
        });

      // 在 y=x 线上的点
      g.append('circle')
        .attr('cx', xScale(xNext))
        .attr('cy', yScale(xNext))
        .attr('r', 4)
        .attr('fill', '#8b5cf6')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('r', 6);
          tooltip
            .style('visibility', 'visible')
            .html(`<div>x: ${xNext.toFixed(6)}</div><div>y: ${xNext.toFixed(6)}</div>`);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
            .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4);
          tooltip.style('visibility', 'hidden');
        });
    }

    // 标记加速点
    if (isFinite(xHat)) {
      g.append('circle')
        .attr('cx', xScale(xHat))
        .attr('cy', yScale(xHat))
        .attr('r', 6)
        .attr('fill', '#ec4899')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('r', 8);
          tooltip
            .style('visibility', 'visible')
            .html(`<div>x̂ₙ: ${xHat.toFixed(6)}</div><div>加速点</div>`);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
            .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 6);
          tooltip.style('visibility', 'hidden');
        });

      g.append('text')
        .attr('x', xScale(xHat))
        .attr('y', yScale(xHat) - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ec4899')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text('x̂ₙ');
    }
  }

  // 弦截法：割线几何意义
  function drawSecantGeometry(g, item, func, width, height, tooltip, containerRef) {
    if (!item || !func) return;

    const x = item.x;
    const fx = item.fx;
    const xPrev = item.xPrev || x - 0.5;
    const fxPrev = item.fxPrev || func(xPrev);
    const xNext = item.xNext;

    const xRange = Math.abs(xNext - x) * 2 || 2;
    const xMin = Math.min(x, xPrev, xNext) - xRange;
    const xMax = Math.max(x, xPrev, xNext) + xRange;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

    const yValues = [fx, fxPrev];
    for (let i = 0; i <= 50; i++) {
      const testX = xMin + (xMax - xMin) * i / 50;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) yValues.push(y);
      } catch (e) {}
    }

    const yMin = Math.min(...yValues, 0) * 1.2;
    const yMax = Math.max(...yValues, 0) * 1.2;
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    // 坐标轴
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // x轴
    if (yMin < 0 && yMax > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);
    }

    // 函数曲线
    const curveData = [];
    for (let i = 0; i <= 100; i++) {
      const testX = xMin + (xMax - xMin) * i / 100;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) {
          curveData.push({ x: testX, y });
        }
      } catch (e) {}
    }

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    g.append('path')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', '#006C39')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // 绘制割线
    const secantSlope = (fx - fxPrev) / (x - xPrev);
    const secantY1 = fx + secantSlope * (xMin - x);
    const secantY2 = fx + secantSlope * (xMax - x);

    g.append('line')
      .attr('x1', xScale(xMin))
      .attr('y1', yScale(secantY1))
      .attr('x2', xScale(xMax))
      .attr('y2', yScale(secantY2))
      .attr('stroke', '#ec4899')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.8);

    // 点 (x_{n-1}, f(x_{n-1}))
    g.append('circle')
      .attr('cx', xScale(xPrev))
      .attr('cy', yScale(fxPrev))
      .attr('r', 5)
      .attr('fill', '#8b5cf6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 7);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>xₙ₋₁: ${xPrev.toFixed(6)}</div><div>f(xₙ₋₁): ${fxPrev.toFixed(6)}</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(xPrev))
      .attr('y', yScale(fxPrev) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('xₙ₋₁');

    // 点 (x_n, f(x_n))
    g.append('circle')
      .attr('cx', xScale(x))
      .attr('cy', yScale(fx))
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 8);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>xₙ: ${x.toFixed(6)}</div><div>f(xₙ): ${fx.toFixed(6)}</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(x))
      .attr('y', yScale(fx) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('xₙ');

    // 点 x_{n+1}
    g.append('circle')
      .attr('cx', xScale(xNext))
      .attr('cy', yScale(0))
      .attr('r', 6)
      .attr('fill', '#ec4899')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 8);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>xₙ₊₁: ${xNext.toFixed(6)}</div><div>y: 0</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(xNext))
      .attr('y', yScale(0) + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('xₙ₊₁');

    // 垂直虚线
    g.append('line')
      .attr('x1', xScale(xPrev))
      .attr('y1', yScale(fxPrev))
      .attr('x2', xScale(xPrev))
      .attr('y2', yScale(0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.5);

    g.append('line')
      .attr('x1', xScale(x))
      .attr('y1', yScale(fx))
      .attr('x2', xScale(x))
      .attr('y2', yScale(0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.5);
  }

  // 二分法：区间收缩可视化
  function drawBisectionGeometry(g, item, func, width, height, tooltip, containerRef) {
    if (!item || !func || !item.interval) return;

    const [a, b] = item.interval;
    const x = item.x;
    const fx = item.fx;

    const xRange = (b - a) * 0.5;
    const xMin = a - xRange;
    const xMax = b + xRange;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

    const yValues = [];
    for (let i = 0; i <= 50; i++) {
      const testX = xMin + (xMax - xMin) * i / 50;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) yValues.push(y);
      } catch (e) {}
    }

    const fa = func(a);
    const fb = func(b);
    yValues.push(fa, fb, fx);

    const yMin = Math.min(...yValues, 0) * 1.2;
    const yMax = Math.max(...yValues, 0) * 1.2;
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    // 坐标轴
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text, line, path')
      .attr('stroke', '#A13F0B')
      .attr('stroke-opacity', 0.7)
      .attr('fill', '#A13F0B')
      .attr('fill-opacity', 0.7);

    // x轴
    if (yMin < 0 && yMax > 0) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);
    }

    // 函数曲线
    const curveData = [];
    for (let i = 0; i <= 100; i++) {
      const testX = xMin + (xMax - xMin) * i / 100;
      try {
        const y = func(testX);
        if (isFinite(y) && Math.abs(y) < 1000) {
          curveData.push({ x: testX, y });
        }
      } catch (e) {}
    }

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    g.append('path')
      .datum(curveData)
      .attr('fill', 'none')
      .attr('stroke', '#006C39')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // 绘制区间矩形
    g.append('rect')
      .attr('x', xScale(a))
      .attr('y', 0)
      .attr('width', xScale(b) - xScale(a))
      .attr('height', height)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.1);

    // 绘制区间端点
    g.append('circle')
      .attr('cx', xScale(a))
      .attr('cy', yScale(fa))
      .attr('r', 5)
      .attr('fill', '#8b5cf6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 7);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>a: ${a.toFixed(6)}</div><div>f(a): ${fa.toFixed(6)}</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(a))
      .attr('y', yScale(fa) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('a');

    g.append('circle')
      .attr('cx', xScale(b))
      .attr('cy', yScale(fb))
      .attr('r', 5)
      .attr('fill', '#8b5cf6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 7);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>b: ${b.toFixed(6)}</div><div>f(b): ${fb.toFixed(6)}</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(b))
      .attr('y', yScale(fb) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('b');

    // 绘制中点
    g.append('circle')
      .attr('cx', xScale(x))
      .attr('cy', yScale(fx))
      .attr('r', 6)
      .attr('fill', '#ec4899')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 8);
        tooltip
          .style('visibility', 'visible')
          .html(`<div>c: ${x.toFixed(6)}</div><div>f(c): ${fx.toFixed(6)}</div><div>中点</div>`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - containerRef.current.offsetTop - 60) + 'px')
          .style('left', (event.pageX - containerRef.current.offsetLeft + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6);
        tooltip.style('visibility', 'hidden');
      });

    g.append('text')
      .attr('x', xScale(x))
      .attr('y', yScale(fx) + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ec4899')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('c=(a+b)/2');

    // 垂直虚线
    [a, x, b].forEach(xVal => {
      g.append('line')
        .attr('x1', xScale(xVal))
        .attr('y1', 0)
        .attr('x2', xScale(xVal))
        .attr('y2', height)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.4);
    });

    // 标注区间长度
    g.append('line')
      .attr('x1', xScale(a))
      .attr('y1', height - 10)
      .attr('x2', xScale(b))
      .attr('y2', height - 10)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('marker-start', 'url(#arrow-start)')
      .attr('marker-end', 'url(#arrow-end)');

    // 添加箭头标记
    const defs = g.append('defs');
    ['start', 'end'].forEach(pos => {
      defs.append('marker')
        .attr('id', `arrow-${pos}`)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', pos === 'start' ? 0 : 10)
        .attr('refY', 5)
        .attr('orient', pos === 'start' ? 180 : 0)
        .append('path')
        .attr('d', 'M0,0 L0,10 L10,5 Z')
        .attr('fill', '#3b82f6');
    });

    g.append('text')
      .attr('x', xScale((a + b) / 2))
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#3b82f6')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(`Δ=${(b - a).toFixed(4)}`);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200 h-full">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
        迭代几何意义
      </h2>
      <div ref={containerRef} className="w-full h-[calc(100%-3rem)] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200 relative" style={{position: 'relative'}}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default GeometricVisualization;

