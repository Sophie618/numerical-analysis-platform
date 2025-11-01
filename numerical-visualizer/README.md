# 数值分析迭代求根可视化系统 ✨

一个**现代化、美观**的交互式数值分析可视化工具，采用最新的 Tailwind CSS 设计语言。

![Modern Design](https://img.shields.io/badge/Design-Modern-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![React](https://img.shields.io/badge/React-18-61dafb)

## 🎨 设计特点

- **玻璃态效果** - 半透明卡片，磨砂玻璃背景模糊
- **流畅渐变** - 多彩渐变按钮和图表
- **现代圆角** - 大圆角设计（16px-24px）
- **柔和阴影** - 多层次阴影营造深度感
- **微交互** - 悬停放大、点击缩小等细腻动画
- **响应式布局** - 完美适配桌面和移动设备

## ✨ 核心功能

### 支持的算法

| 算法 | 收敛阶 | 特点 |
|------|--------|------|
| **二分法** (Bisection) | 线性 | 稳定可靠，需要区间 |
| **牛顿法** (Newton) | 二次 | 收敛最快，需要导数 |
| **埃特肯法** (Aitken) | 二次 | 加速收敛序列 |
| **弦截法** (Secant) | 超线性 (1.618) | 无需导数 |

### 可视化功能

1. **函数曲线绘制** 🎯
   - D3.js 动态绘制
   - 渐变色曲线
   - 实时迭代点标注
   - 切线/割线展示

2. **收敛速度分析** 📊
   - 对数坐标误差图
   - 收敛率可视化
   - 实时误差标注

3. **收敛盆热力图** 🗺️
   - 彩色热力图
   - 不同初值收敛分析
   - 实时计算进度

4. **详细数据表格** 📋
   - 完整迭代历史
   - 高亮当前步骤
   - 响应式设计

### 交互控制

- ⏮ ⏪ ▶ ⏸ ⏩ ⏭ 完整播放控制
- 🎚️ 速度调节 (0.1x - 3.0x)
- 📊 进度条跳转
- 📄 数据导出 (CSV/JSON)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
npm run build
```

## 📦 技术栈

- **React 18** - 最新前端框架
- **Vite** - 极速构建工具
- **Tailwind CSS** - 现代化 CSS 框架
- **D3.js v7** - 强大的数据可视化
- **math.js** - 数学表达式解析

## 🎯 使用说明

### 1. 选择算法
点击顶部的算法按钮，选择四种算法之一

### 2. 设置函数
- 从5个预设函数中选择
- 或输入自定义数学表达式

### 3. 调整参数
- 初值/区间起点
- 容许误差
- 最大迭代次数

### 4. 观察可视化
- 自动开始计算
- 使用播放控制器观察动画
- 查看实时数据更新

### 5. 导出数据
点击 CSV 或 JSON 按钮导出完整数据

## 📐 支持的数学表达式

使用 math.js 解析，支持：

- 基本运算: `+`, `-`, `*`, `/`, `^`
- 函数: `sqrt()`, `sin()`, `cos()`, `tan()`, `exp()`, `log()`, `ln()`
- 常数: `pi`, `e`

### 示例表达式

```javascript
x^2 - 2          // 求 √2
sin(x) - x/2     // 超越方程
exp(x) - 3       // 指数方程
x^3 - 2*x - 5    // 三次方程
log(x) - 1       // 求 e
```

## 🎨 设计系统

### 颜色方案

- **Primary**: 蓝色渐变 (#3b82f6 → #8b5cf6)
- **Accent**: 粉色渐变 (#ec4899)
- **Success**: 绿色渐变 (#10b981)
- **Warning**: 橙色渐变 (#f59e0b)

### 间距系统

- **XS**: 0.5rem (8px)
- **SM**: 0.75rem (12px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)

### 圆角系统

- **SM**: 0.5rem (8px)
- **MD**: 0.75rem (12px)
- **LG**: 1rem (16px)
- **XL**: 1.5rem (24px)
- **2XL**: 2rem (32px)

## 🌟 特色亮点

### 玻璃态设计 (Glass morphism)

```jsx
className="glass rounded-3xl p-6 shadow-xl border border-white/40"
```

- 半透明背景
- 背景模糊效果
- 柔和边框
- 多层阴影

### 渐变按钮

```jsx
className="bg-gradient-to-r from-blue-500 to-indigo-600"
```

- 流畅的颜色过渡
- 悬停放大效果
- 阴影增强

### 微交互动画

- `hover:scale-105` - 悬停放大 5%
- `transition-all duration-200` - 200ms 流畅过渡
- `animate-pulse-glow` - 自定义脉冲动画

## 📱 响应式设计

- **桌面** (≥1024px): 双列布局
- **平板** (768px-1023px): 单列布局
- **手机** (<768px): 堆叠布局，优化触摸

## 🔧 项目结构

```
numerical-visualizer/
├── src/
│   ├── algorithms/          # 算法实现
│   ├── components/          # React 组件
│   │   ├── FunctionInput.jsx
│   │   ├── AnimationController.jsx
│   │   ├── FunctionPlot.jsx
│   │   ├── ConvergenceChart.jsx
│   │   ├── DataTable.jsx
│   │   ├── BasinPlot.jsx
│   │   └── ExportButton.jsx
│   ├── App.jsx             # 主应用
│   ├── index.css           # Tailwind + 自定义样式
│   └── main.jsx
├── tailwind.config.js      # Tailwind 配置
└── vite.config.js          # Vite 配置
```

## 🎓 算法详解

### 二分法
稳定的区间二分策略，每次迭代区间减半。

### 牛顿法
使用函数的切线逼近根，收敛速度最快（二次收敛）。

### 埃特肯法
基于不动点迭代的加速方法，可以将线性收敛加速到二次收敛。

### 弦截法
用割线代替切线，不需要计算导数，收敛速度介于二分法和牛顿法之间。

## 📈 性能优化

- **懒加载组件** - React.lazy
- **优化的 Canvas 渲染** - 降低收敛盆分辨率
- **防抖更新** - 参数变化使用 useCallback
- **CSS 性能** - 使用 transform 而不是 top/left

## 🌐 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

Made with ❤️ using React, Tailwind CSS, and D3.js
