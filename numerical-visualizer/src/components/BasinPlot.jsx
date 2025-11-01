import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

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

    const computeBasin = async () => {
      setIsComputing(true);
      setProgress(0);

      const xMin = parameters.x0 - 3;
      const xMax = parameters.x0 + 3;
      const resolution = 100;
      const dx = (xMax - xMin) / resolution;

      const imageData = ctx.createImageData(width, height);
      const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, parameters.maxIterations]);

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x0 = xMin + i * dx;
          let iterations = 0;
          let converged = false;

          try {
            if (algorithm === 'newton') {
              let x = x0;
              for (let k = 0; k < parameters.maxIterations; k++) {
                const fx = func(x);
                const dfx = df ? df(x) : (func(x + 1e-6) - func(x - 1e-6)) / (2e-6);
                if (Math.abs(dfx) < 1e-12) break;
                const xNew = x - fx / dfx;
                if (Math.abs(xNew - x) < parameters.tolerance || Math.abs(fx) < parameters.tolerance) {
                  converged = true;
                  iterations = k;
                  break;
                }
                x = xNew;
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
                if (!isFinite(x) || Math.abs(x) > 100) break;
              }
            }
          } catch (err) {
            iterations = parameters.maxIterations;
          }

          if (!converged) iterations = parameters.maxIterations;

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
        setProgress((i / resolution) * 100);
        if (i % 10 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      }

      ctx.putImageData(imageData, 0, 0);
      setIsComputing(false);
      setProgress(100);
    };

    computeBasin();
  }, [algorithm, func, df, parameters]);

  return (
    <div className="glass rounded-3xl p-6 shadow-xl border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">收敛盆分析</h2>
        {isComputing && (
          <span className="text-xs font-medium text-blue-600 px-3 py-1 bg-blue-100 rounded-full">
            计算中... {progress.toFixed(0)}%
          </span>
        )}
      </div>
      <div ref={containerRef} className="w-full h-[350px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        {!func && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500">请选择算法和函数开始分析</p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 rounded bg-gradient-to-r from-[#440154] to-[#31688e]"></div>
          <span className="text-xs text-slate-600">快速收敛</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 rounded bg-gradient-to-r from-[#31688e] to-[#35b779]"></div>
          <span className="text-xs text-slate-600">慢速收敛</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 rounded bg-gradient-to-r from-[#35b779] to-[#fde724] opacity-50"></div>
          <span className="text-xs text-slate-600">不收敛</span>
        </div>
      </div>
    </div>
  );
}

export default BasinPlot;
