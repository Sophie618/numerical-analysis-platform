/**
 * 弦截法 (Secant Method)
 * 用于求解方程 f(x) = 0
 * 不需要导数，使用两个点的割线逼近
 * 
 * @param {Function} f - 目标函数
 * @param {number} x0 - 第一个初始值
 * @param {number} x1 - 第二个初始值
 * @param {number} tolerance - 容许误差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {Object} 包含迭代历史的结果对象
 */
export function secant(f, x0, x1, tolerance = 1e-6, maxIterations = 100) {
  const history = [];
  let xPrev = x0;
  let x = x1;
  let iteration = 0;
  
  let fPrev = f(xPrev);
  let fx = f(x);
  
  while (iteration < maxIterations) {
    // 计算割线的斜率
    const denominator = fx - fPrev;
    
    if (Math.abs(denominator) < 1e-12) {
      throw new Error('函数值差异过小，无法继续迭代');
    }
    
    // 弦截法公式: x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
    const xNew = x - fx * (x - xPrev) / denominator;
    const fNew = f(xNew);
    const error = Math.abs(xNew - x);
    
    // 计算收敛率
    let convergenceRate = null;
    if (history.length >= 2) {
      const e_n = history[history.length - 1].error;
      const e_n1 = history[history.length - 2].error;
      if (e_n1 !== 0 && error !== 0) {
        convergenceRate = Math.log(error) / Math.log(e_n);
      }
    }
    
    // 存储割线信息用于可视化
    const secantLine = {
      points: [[xPrev, fPrev], [x, fx]],
      slope: denominator / (x - xPrev),
      xIntercept: xNew
    };
    
    history.push({
      iteration: iteration + 1,
      xPrev: xPrev,
      x: x,
      fPrev: fPrev,
      fx: fx,
      xNext: xNew,
      fNext: fNew,
      error: error,
      convergenceRate: convergenceRate,
      secantLine: secantLine
    });
    
    // 检查收敛
    if (Math.abs(fNew) < tolerance || error < tolerance) {
      break;
    }
    
    // 更新值
    xPrev = x;
    x = xNew;
    fPrev = fx;
    fx = fNew;
    iteration++;
  }
  
  const finalResult = history[history.length - 1];
  
  return {
    root: finalResult.xNext,
    fx: finalResult.fNext,
    iterations: iteration + 1,
    converged: Math.abs(finalResult.fNext) < tolerance || finalResult.error < tolerance,
    history: history,
    method: 'Secant'
  };
}

