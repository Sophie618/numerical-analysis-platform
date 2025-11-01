/**
 * 埃特肯加速法 (Aitken's Δ² Method)
 * 用于加速线性收敛序列的收敛速度
 * 
 * @param {Function} g - 迭代函数 x_{n+1} = g(x_n)
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 容许误差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {Object} 包含迭代历史的结果对象
 */
export function aitken(g, x0, tolerance = 1e-6, maxIterations = 100) {
  const history = [];
  let x = x0;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    // 计算三个连续的迭代值
    const x1 = g(x);
    const x2 = g(x1);
    
    // Aitken 加速公式: x̂ = x - (x1 - x)² / (x2 - 2*x1 + x)
    const denominator = x2 - 2 * x1 + x;
    
    let xHat;
    if (Math.abs(denominator) < 1e-12) {
      // 如果分母接近零，使用普通迭代
      xHat = x2;
    } else {
      xHat = x - Math.pow(x1 - x, 2) / denominator;
    }
    
    const error = Math.abs(xHat - x);
    
    // 计算收敛率
    let convergenceRate = null;
    if (history.length >= 2) {
      const e_n = history[history.length - 1].error;
      const e_n1 = history[history.length - 2].error;
      if (e_n1 !== 0 && error !== 0) {
        convergenceRate = Math.log(error) / Math.log(e_n);
      }
    }
    
    history.push({
      iteration: iteration + 1,
      x: x,
      x1: x1,
      x2: x2,
      xHat: xHat,
      error: error,
      convergenceRate: convergenceRate
    });
    
    // 检查收敛
    if (error < tolerance) {
      break;
    }
    
    x = xHat;
    iteration++;
  }
  
  const finalResult = history[history.length - 1];
  
  return {
    root: finalResult.xHat,
    fx: null, // Aitken方法不直接计算函数值
    iterations: iteration + 1,
    converged: finalResult.error < tolerance,
    history: history,
    method: 'Aitken'
  };
}

/**
 * 从求根问题构造不动点迭代函数
 * 对于 f(x) = 0，可以构造 g(x) = x - f(x) 或其他形式
 * 
 * @param {Function} f - 目标函数
 * @param {number} lambda - 松弛因子（可选）
 * @returns {Function} 迭代函数
 */
export function createIterationFunction(f, lambda = 1) {
  return (x) => x - lambda * f(x);
}

