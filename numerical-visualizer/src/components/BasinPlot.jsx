import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './BasinPlot.css';

/**
 * 收敛盆分析组件
 * 显示不同初值的收敛情况
 */
function BasinPlot({ algorithm, func, df, parameters }) {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [isComputing, setIsComputing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!algorithm || !func || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // 计算收敛盆
    const computeBasin = async () => {
      setIsComputing(true);
      setProgress(0);

      // 定义初值范围
      const xMin = parameters.x0 - 3;
      const xMax = parameters.x0 + 3;
      const resolution = 100; // 降低分辨率以提高性能
      const dx = (xMax - xMin) / resolution;

      // 创建图像数据
      const imageData = ctx.createImageData(width, height);

      // 颜色映射
      const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, parameters.maxIterations]);

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x0 = xMin + i * dx;
          
          let iterations = 0;
          let converged = false;

          try {
            // 运行算法
            if (algorithm === 'bisection') {
              // 二分法需要区间，暂不支持
              iterations = parameters.maxIterations / 2;
            } else if (algorithm === 'newton') {
              let x = x0;
              for (let k = 0; k < parameters.maxIterations; k++) {
                const fx = func(x);
                const dfx = df ? df(x) : numericalDerivative(func, x);
                
                if (Math.abs(dfx) < 1e-12) break;
                
                const xNew = x - fx / dfx;
                if (Math.abs(xNew - x) < parameters.tolerance || Math.abs(fx) < parameters.tolerance) {
                  converged = true;
                  iterations = k;
                  break;
                }
                x = xNew;
                
                // 发散检测
                if (!isFinite(x) || Math.abs(x) > 100) break;
              }
            } else if (algorithm === 'secant') {
              let xPrev = x0;
              let x = x0 + 0.1;
              let fPrev = func(xPrev);
              
              for (let k = 0; k < parameters.maxIterations; k++) {
                const fx = func(x);
                const denominator = fx - fPrev;
                
                if (Math.abs(denominator) < 1e-12) break;
                
                const xNew = x - fx * (x - xPrev) / denominator;
                if (Math.abs(xNew - x) < parameters.tolerance || Math.abs(fx) < parameters.tolerance) {
                  converged = true;
                  iterations = k;
                  break;
                }
                
                xPrev = x;
                x = xNew;
                fPrev = fx;
                
                // 发散检测
                if (!isFinite(x) || Math.abs(x) > 100) break;
              }
            }
          } catch (err) {
            // 计算错误，标记为不收敛
            iterations = parameters.maxIterations;
          }

          if (!converged) {
            iterations = parameters.maxIterations;
          }

          // 映射到像素
          const pixelX = Math.floor((i / resolution) * width);
          const pixelY = Math.floor((j / resolution) * height);
          
          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const color = d3.color(colorScale(iterations));
            const index = (pixelY * width + pixelX) * 4;
            
            imageData.data[index] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = converged ? 255 : 128;
          }
        }
        
        // 更新进度
        setProgress((i / resolution) * 100);
        
        // 每处理一些行后暂停一下，让UI更新
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsComputing(false);
      setProgress(100);
    };

    computeBasin();
  }, [algorithm, func, df, parameters]);

  const numericalDerivative = (f, x) => {
    const h = 1e-6;
    return (f(x + h) - f(x - h)) / (2 * h);
  };

  return (
    <div className="chart-container basin-plot-container">
      <div className="chart-title">
        收敛盆分析
        {isComputing && (
          <span className="computing-badge">
            计算中... {progress.toFixed(0)}%
          </span>
        )}
      </div>
      <div className="chart-content" ref={containerRef}>
        <canvas ref={canvasRef}></canvas>
        {!func && (
          <div className="empty-state">
            <p>请选择算法和函数开始分析</p>
          </div>
        )}
      </div>
      <div className="basin-legend">
        <div className="legend-item">
          <div className="legend-color fast"></div>
          <span>快速收敛</span>
        </div>
        <div className="legend-item">
          <div className="legend-color slow"></div>
          <span>慢速收敛</span>
        </div>
        <div className="legend-item">
          <div className="legend-color diverge"></div>
          <span>不收敛</span>
        </div>
      </div>
    </div>
  );
}

export default BasinPlot;

