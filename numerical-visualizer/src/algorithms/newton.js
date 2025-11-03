/**
 * 牛顿法 (Newton's Method)
 * 用于求解方程 f(x) = 0
 * 
 * @param {Function} f - 目标函数
 * @param {Function} df - 导数函数
 * @param {number} x0 - 初始值
 * @param {number} tolerance - 容许误差
 * @param {number} maxIterations - 最大迭代次数
 * @param {boolean} useDamping - 是否使用下山条件
 * @returns {Object} 包含迭代历史的结果对象
 */
export function newton(f, df, x0, tolerance = 1e-6, maxIterations = 100, useDamping = false) {
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
    
    let xNew, lambda = 1.0;
    const dampingAttempts = [];
    
    if (useDamping) {
      // 牛顿下山法：使用下山因子 λ
      let satisfied = false;
      let dampingIter = 0;
      const maxDampingIter = 20; // 最多尝试20次下山
      
      while (!satisfied && dampingIter < maxDampingIter) {
        lambda = 1.0 / Math.pow(2, dampingIter);
        xNew = x - lambda * fx / dfx;
        const fxNew = f(xNew);
        
        // 记录尝试点
        dampingAttempts.push({
          lambda: lambda,
          x: xNew,
          fx: fxNew,
          satisfied: Math.abs(fxNew) < Math.abs(fx)
        });
        
        // 下山条件：|f(x_{n+1})| < |f(x_n)|
        if (Math.abs(fxNew) < Math.abs(fx)) {
          satisfied = true;
        } else {
          dampingIter++;
        }
      }
      
      if (!satisfied) {
        // 如果所有下山尝试都失败，使用最后一个
        console.warn(`下山条件在第 ${iteration + 1} 次迭代中未满足`);
      }
    } else {
      // 标准牛顿法
      xNew = x - fx / dfx;
      dampingAttempts.push({
        lambda: 1.0,
        x: xNew,
        fx: f(xNew),
        satisfied: true
      });
    }
    
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
      tangentLine: tangentLine,
      lambda: lambda,
      dampingAttempts: dampingAttempts,
      usedDamping: useDamping
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
    method: 'Newton',
    usedDamping: useDamping
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

