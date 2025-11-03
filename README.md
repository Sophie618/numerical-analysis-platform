# 🎯 数值分析迭代求根可视化平台

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![D3.js](https://img.shields.io/badge/D3.js-v7-f9a03c?logo=d3.js)
![License](https://img.shields.io/badge/License-MIT-green)

**一个现代化、美观的交互式数值分析可视化工具**

[功能特性](#-功能特性) | [快速开始](#-快速开始) | [使用说明](#-使用说明) | [技术栈](#-技术栈)

</div>

---

## ✨ 项目简介

这是一个专用于**数值分析迭代求根算法**的可视化平台，采用最新的 Web 技术栈构建，提供直观、美观、交互式的算法演示。通过丰富的可视化手段，帮助用户深入理解数值分析中的经典算法。

### 🎨 设计亮点

- **现代化 UI** - 采用 Tailwind CSS 构建，清晰简洁的设计风格
- **流畅动画** - 细腻的过渡效果和微交互
- **响应式布局** - 完美适配桌面和移动设备
- **主题配色** - 精心设计的BIT特色双主题色系

---

## 🚀 功能特性

### 📊 支持的算法

| 算法 | 收敛阶 | 特点 | 适用场景 |
|------|--------|------|----------|
| **二分法** (Bisection) | 线性 | 稳定可靠 | 需要区间，保证收敛 |
| **埃特肯法** (Aitken) | 二次 | 加速收敛 | 适合慢收敛序列 |
| **牛顿法** (Newton) | 二次 | 收敛最快 | 需要导数，初值敏感 |
| **双点弦截法** (Secant) | 超线性 (r≈1.618) | 无需导数 | 平衡速度和简单性 |

### 🎯 核心可视化功能

#### 1. 函数曲线绘制 📈
- 使用 D3.js 动态渲染函数曲线
- 实时标注迭代点和连接线
- **缩放和拖动功能** - 支持鼠标滚轮缩放和拖动平移
- **悬浮显示坐标** - 鼠标悬停在迭代点上显示详细坐标信息
- 显示切线/割线辅助几何元素
- 牛顿下山法的 λ 因子可视化（显示所有尝试点）

#### 2. 几何意义可视化 🔍
- **牛顿法** - 动态显示切线与 x 轴交点的几何意义
- **埃特肯法** - 展示迭代加速的几何构造过程
- **双点弦截法** - 演示割线逼近的几何原理
- **二分法** - 区间二分的几何示意图
- 所有可视化均支持**悬浮显示坐标详情**

#### 3. 收敛速度分析 📉
- 对数坐标误差图
- 实时收敛率计算
- **悬浮显示详细信息** - 迭代次数、误差、收敛率
- 误差下降趋势可视化

#### 4. 详细数据表格 📋
- 完整迭代历史记录
- 高亮当前步骤
- 牛顿法显示下山因子 λ 和尝试次数
- 响应式设计，自适应屏幕宽度

#### 5. 牛顿下山条件 🏔️
- 可选开关启用/禁用下山条件
- 实时显示下山因子 λ 的调整过程
- 可视化展示每次下山尝试的结果
- 数据表格中标记下山步骤（橙色高亮）

### 🎮 交互控制

- ⏮ ⏪ ▶ ⏸ ⏩ ⏭ **完整播放控制**
- 🎚️ **速度调节** (0.1x - 3.0x)
- 📊 **进度条跳转** - 点击任意位置快速定位
- 📥 **数据导出** (CSV/JSON)
- 🔍 **图表缩放拖动** - 函数图支持交互式探索
- 💡 **悬浮提示** - 所有关键点均支持坐标显示

---

## 📦 技术栈

```
Frontend Framework:  React 18
Routing:             React Router
Build Tool:          Vite
Styling:             Tailwind CSS
Visualization:       D3.js v7
Math Parser:         math.js
State Management:    Context API
```

### 🏗️ 项目架构

```
numerical-analysis/
└── numerical-visualizer/         # 主项目
    ├── src/
    │   ├── algorithms/           # 算法核心实现
    │   │   ├── bisection.js     # 二分法
    │   │   ├── aitken.js        # 埃特肯法
    │   │   ├── newton.js        # 牛顿法（含下山条件）
    │   │   ├── secant.js        # 双点弦截法
    │   │   └── index.js         # 算法配置与预设函数
    │   │
    │   ├── components/           # React 组件
    │   │   ├── Header.jsx       # 导航头部
    │   │   ├── Sidebar.jsx      # 侧边栏（包含所有控制）
    │   │   ├── FunctionInput.jsx
    │   │   ├── AnimationController.jsx
    │   │   ├── FunctionPlot.jsx              # 函数曲线图
    │   │   ├── GeometricVisualization.jsx    # 几何意义可视化
    │   │   ├── ConvergenceChart.jsx          # 收敛速度图
    │   │   ├── DataTable.jsx
    │   │   └── ExportButton.jsx
    │   │
    │   ├── pages/               # 页面组件
    │   │   ├── Home.jsx        # 首页
    │   │   ├── AlgorithmPage.jsx  # 算法通用页面
    │   │   ├── BisectionPage.jsx
    │   │   ├── AitkenPage.jsx
    │   │   ├── NewtonPage.jsx
    │   │   └── SecantPage.jsx
    │   │
    │   ├── context/             # 全局状态管理
    │   │   └── SettingsContext.jsx
    │   │
    │   ├── App.jsx             # 主应用
    │   ├── index.css           # Tailwind + 全局样式
    │   └── main.jsx            # 入口文件
    │
    ├── tailwind.config.js      # Tailwind 配置
    ├── vite.config.js          # Vite 配置
    └── package.json
```

---

## 🛠️ 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Sophie618/numerical-analysis-platform.git
cd numerical-analysis-platform/numerical-visualizer

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# http://localhost:5173
```

### 构建生产版本

```bash
npm run build
npm run preview
```

---

## 📖 使用说明

### 1️⃣ 选择算法

点击顶部导航栏的算法按钮：
- **二分法** - 稳定可靠的区间二分策略
- **埃特肯法** - 加速收敛的迭代方法
- **牛顿法** - 基于切线的快速收敛方法（可选下山条件）
- **双点弦截法** - 使用割线逼近，无需导数

### 2️⃣ 设置函数

**预设函数：**
- `x² - 2` - 求 √2
- `sin(x) - x/2` - 超越方程
- `x³ - x - 2` - 三次方程
- `e^x - 3` - 指数方程
- `x⁴ - 2x³ - 4x² + 4x + 4` - 高次多项式

**自定义函数：**
支持任意数学表达式，例如：
```
x^2 - 4
sin(x) - 0.5
exp(x) - x - 2
log(x) - 1
```

### 3️⃣ 调整参数

- **初值 (x₀)** / **区间端点 (x₀, x₁)**: 算法起始点
- **容许误差**: 收敛判断阈值（默认 1e-6）
- **最大迭代次数**: 防止无限循环（默认 100）
- **牛顿下山条件** : 启用后保证 |f(x_{n+1})| < |f(x_n)|

### 4️⃣ 观察可视化

#### 函数曲线图
- 查看函数曲线和迭代点
- 使用鼠标滚轮**缩放**图表
- 拖动鼠标**平移**图表
- 悬停在迭代点上查看**详细坐标**
- 观察牛顿法的下山尝试点（绿色/红色标记）

#### 几何意义图
- 观察算法的几何解释
- 悬停在关键点上查看坐标信息
- 理解算法背后的数学原理

#### 收敛速度图
- 对数坐标显示误差下降
- 悬停查看每步的误差和收敛率
- 分析收敛速度特性

#### 数据表格
- 查看完整迭代历史
- 当前步骤高亮显示
- 牛顿法显示 λ 因子和尝试次数

### 5️⃣ 使用播放控制

- **播放/暂停**: 自动演示迭代过程
- **速度调节**: 0.1x - 3.0x 播放速度
- **步进控制**: 逐步查看每次迭代
- **进度条**: 快速跳转到任意步骤

### 6️⃣ 导出数据

点击侧边栏底部的导出按钮：
- **CSV**: 适合在 Excel 中分析
- **JSON**: 保留完整的元数据信息

---

## 🎓 算法详解

### 二分法 (Bisection Method)
通过不断将区间对半分，逐步缩小根所在的范围。稳定可靠，线性收敛（每次迭代误差减半）。

**特点**: 
- ✅ 保证收敛
- ✅ 不需要导数
- ❌ 收敛速度较慢
- ❌ 需要提供初始区间

### 埃特肯法 (Aitken's Method)
对慢收敛的迭代序列进行加速，通过构造新的序列提高收敛速度，可将线性收敛加速到二次收敛。

**特点**:
- ✅ 加速收敛效果显著
- ✅ 适用于各种迭代序列
- ❌ 需要三个连续的迭代值
- ❌ 对某些函数可能不稳定

### 牛顿法 (Newton's Method)
使用函数在当前点的切线与 x 轴交点作为下一个迭代点。二次收敛，收敛速度最快。

**特点**:
- ✅ 二次收敛，速度快
- ✅ 几何意义直观
- ❌ 需要计算导数
- ❌ 对初值敏感
- ✅ **支持下山条件**: 保证函数值单调下降

**下山条件**: 自动调整步长 λ，确保 |f(x_{n+1})| < |f(x_n)|，提高算法稳定性。

### 双点弦截法 (Two-Point Secant Method)
用两点连线的割线代替切线，避免计算导数。超线性收敛（收敛阶约为黄金比例 r ≈ 1.618）。

**特点**:
- ✅ 无需计算导数
- ✅ 收敛速度优于二分法
- ✅ 几何意义清晰
- ❌ 需要两个初值

**注**: 单点弦截法需要预先给定斜率且对初值敏感、收敛性不稳定，故仅展示双点弦截法。

---

## 🌟 特色亮点

### 实用价值

- ✅ **直观展示** - 动画演示算法每一步，配合几何意义图
- ✅ **对比分析** - 支持多种算法，便于对比收敛速度
- ✅ **数据详实** - 完整的迭代数据记录和可视化
- ✅ **交互式学习** - 自由调整参数，实时观察变化
- ✅ **深度理解** - 几何意义可视化帮助理解算法原理
- ✅ **高级特性** - 牛顿下山条件等进阶内容

### 技术亮点

- ⚡ **高性能** - Vite 极速构建
- 🎨 **现代设计** - Tailwind CSS 美化
- 📊 **强大可视化** - D3.js 专业图表，支持缩放拖动
- 💡 **交互增强** - 悬浮提示、动态反馈
- 📱 **响应式** - 完美适配各种设备
- 🧩 **模块化设计** - 组件化开发，易于维护扩展

---

## 🎨 设计系统

### 主题配色

- **Primary (主题绿)**: `#006C39`
- **Secondary (主题棕)**: `#A13F0B` 
- **Accent**: 蓝紫渐变 - 标题和强调元素
- **中性色**: 黑白灰 系列 - 文字和边框

### 色彩应用

- 函数曲线: 绿色半透明，清晰可见
- 坐标轴: 棕色半透明，不喧宾夺主
- 迭代点: 蓝紫渐变，醒目突出
- 下山尝试: 绿色（满足）/ 红色（不满足）

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发建议

- 遵循现有的代码风格
- 添加适当的注释
- 更新相关文档
- 确保所有功能正常工作

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 💻 技术栈致谢

- [React](https://reactjs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [D3.js](https://d3js.org/) - 数据可视化
- [math.js](https://mathjs.org/) - 数学表达式解析
- [React Router](https://reactrouter.com/) - 路由管理

---

## 📬 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/Sophie618/numerical-analysis-platform/issues)
- Email: [联系作者](mailto:your-email@example.com)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ by [Sophie618](https://github.com/Sophie618)

</div>
