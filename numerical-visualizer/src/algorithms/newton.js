/**
 * 牛顿法 (Newton's Method)
 * 用于求解方程 f(x) = 0
 * 
 * @param {Function} f - 目标函数
 * @param {Function} df - 导数函数
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 容许误差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {Object} 包含迭代历史的结果对象
 */
export function newton(f, df, x0, tolerance = 1e-6, maxIterations = 100) {
  const history = [];
  let x = x0;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    const fx = f(x);
    const dfx = df(x);
    
    // 检查导数是否为零
    if (Math.abs(dfx) < 1e-12) {
      throw new Error('导数接近零，无法继续迭代');
    }
    
    const xNew = x - fx / dfx;
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
    
    // 存储切线信息用于可视化
    const tangentLine = {
      point: [x, fx],
      slope: dfx,
      xIntercept: xNew
    };
    
    history.push({
      iteration: iteration + 1,
      x: x,
      fx: fx,
      dfx: dfx,
      xNext: xNew,
      error: error,
      convergenceRate: convergenceRate,
      tangentLine: tangentLine
    });
    
    // 检查收敛
    if (Math.abs(fx) < tolerance || error < tolerance) {
      x = xNew;
      break;
    }
    
    x = xNew;
    iteration++;
  }
  
  const finalResult = history[history.length - 1];
  
  return {
    root: finalResult.xNext || x,
    fx: f(finalResult.xNext || x),
    iterations: iteration + 1,
    converged: Math.abs(finalResult.fx) < tolerance || finalResult.error < tolerance,
    history: history,
    method: 'Newton'
  };
}

/**
 * 数值导数计算（用于没有解析导数的情况）
 * 
 * @param {Function} f - 目标函数
 * @param {number} h - 步长
 * @returns {Function} 导数函数
 */
export function numericalDerivative(f, h = 1e-6) {
  return (x) => (f(x + h) - f(x - h)) / (2 * h);
}

