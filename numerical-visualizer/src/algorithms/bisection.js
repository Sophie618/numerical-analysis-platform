/**
 * 二分法 (Bisection Method)
 * 用于求解方程 f(x) = 0 在区间 [a, b] 上的根
 * 
 * @param {Function} f - 目标函数
 * @param {number} a - 区间起点
 * @param {number} b - 区间终点
 * @param {number} tolerance - 容许误差
 * @param {number} maxIterations - 最大迭代次数
 * @returns {Object} 包含迭代历史的结果对象
 */
export function bisection(f, a, b, tolerance = 1e-6, maxIterations = 100) {
  const history = [];
  let iteration = 0;
  let fa = f(a);
  let fb = f(b);
  
  // 检查初始条件
  if (fa * fb > 0) {
    throw new Error('函数在区间端点处的值必须异号');
  }
  
  let left = a;
  let right = b;
  let prevMid = null;
  
  while (iteration < maxIterations) {
    const mid = (left + right) / 2;
    const fmid = f(mid);
    
    // 计算误差
    const error = prevMid !== null ? Math.abs(mid - prevMid) : Math.abs(right - left);
    
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
      x: mid,
      fx: fmid,
      interval: [left, right],
      error: error,
      convergenceRate: convergenceRate
    });
    
    // 检查收敛
    if (Math.abs(fmid) < tolerance || error < tolerance) {
      break;
    }
    
    // 更新区间
    if (fa * fmid < 0) {
      right = mid;
      fb = fmid;
    } else {
      left = mid;
      fa = fmid;
    }
    
    prevMid = mid;
    iteration++;
  }
  
  const finalResult = history[history.length - 1];
  
  return {
    root: finalResult.x,
    fx: finalResult.fx,
    iterations: iteration + 1,
    converged: Math.abs(finalResult.fx) < tolerance || finalResult.error < tolerance,
    history: history,
    method: 'Bisection'
  };
}

