/**
 * 导出所有算法
 */
export { bisection } from './bisection.js';
export { newton, numericalDerivative } from './newton.js';
export { aitken, createIterationFunction } from './aitken.js';
export { secant } from './secant.js';

/**
 * 算法信息配置
 */
export const ALGORITHMS = {
  bisection: {
    name: 'Bisection',
    displayName: '二分法',
    description: '通过不断二分区间来逼近根',
    requiresInterval: true,
    requiresDerivative: false,
    convergenceOrder: 1, // 线性收敛
  },
  newton: {
    name: 'Newton',
    displayName: '牛顿法（可选下山条件）',
    description: '使用切线逼近根，收敛速度快',
    requiresInterval: false,
    requiresDerivative: true,
    convergenceOrder: 2, // 二次收敛
  },
  aitken: {
    name: 'Aitken',
    displayName: '埃特肯法',
    description: '加速线性收敛序列的收敛速度',
    requiresInterval: false,
    requiresDerivative: false,
    convergenceOrder: 2, // 二次收敛（加速后）
  },
  secant: {
    name: 'Secant',
    displayName: '双点弦截法',
    description: '使用两点割线逼近根，不需要导数',
    requiresInterval: false,
    requiresDerivative: false,
    convergenceOrder: 1.618, // 超线性收敛（黄金比例）
    note: '* 单点弦截法由于需要预先给定斜率且对初值敏感、收敛性不稳定，故此处仅展示双点弦截法'
  }
};

/**
 * 预设函数库
 */
export const PRESET_FUNCTIONS = [
  {
    id: 'quadratic',
    name: 'x² - 2',
    expression: 'x^2 - 2',
    f: (x) => x * x - 2,
    df: (x) => 2 * x,
    root: Math.sqrt(2),
    suggestedInterval: [0, 2],
    suggestedInitial: 1.5
  },
  {
    id: 'sin',
    name: 'sin(x) - x/2',
    expression: 'sin(x) - x/2',
    f: (x) => Math.sin(x) - x / 2,
    df: (x) => Math.cos(x) - 0.5,
    root: 1.8955,
    suggestedInterval: [1, 3],
    suggestedInitial: 2
  },
  {
    id: 'cubic',
    name: 'x³ - x - 2',
    expression: 'x^3 - x - 2',
    f: (x) => x * x * x - x - 2,
    df: (x) => 3 * x * x - 1,
    root: 1.5214,
    suggestedInterval: [1, 2],
    suggestedInitial: 1.5
  },
  {
    id: 'exp',
    name: 'e^x - 3',
    expression: 'e^x - 3',
    f: (x) => Math.exp(x) - 3,
    df: (x) => Math.exp(x),
    root: Math.log(3),
    suggestedInterval: [0, 2],
    suggestedInitial: 1
  },
  {
    id: 'polynomial',
    name: 'x⁴ - 2x³ - 4x² + 4x + 4',
    expression: 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4',
    f: (x) => x**4 - 2*x**3 - 4*x*x + 4*x + 4,
    df: (x) => 4*x**3 - 6*x*x - 8*x + 4,
    root: 2.4142, // 近似值
    suggestedInterval: [2, 3],
    suggestedInitial: 2.5
  }
];

