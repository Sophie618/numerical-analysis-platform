# 🎯 数值分析迭代求根可视化平台

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![D3.js](https://img.shields.io/badge/D3.js-v7-f9a03c?logo=d3.js)
![License](https://img.shields.io/badge/License-MIT-green)

**一个现代化、美观的交互式数值分析可视化工具**

[在线演示](#) | [功能特性](#-功能特性) | [快速开始](#-快速开始) | [文档](#-文档)

</div>

---

## ✨ 项目简介

这是一个专注于**迭代求根算法**的可视化教学平台，采用最新的 Web 技术栈构建，提供直观、美观、交互式的算法演示。

### 🎨 设计风格

- **玻璃态效果** (Glassmorphism) - 半透明毛玻璃设计
- **流畅渐变** - 多彩渐变色彩方案
- **微交互** - 细腻的动画和过渡效果
- **现代化 UI** - 采用 Tailwind CSS 构建

### 🎥 功能预览

<div align="center">
  <img src="https://via.placeholder.com/800x450/667eea/ffffff?text=Demo+Screenshot" alt="项目截图" width="100%">
  <p><em>实时动画展示算法收敛过程</em></p>
</div>

---

## 🚀 功能特性

### 📊 支持的算法

| 算法 | 收敛阶 | 特点 | 适用场景 |
|------|--------|------|----------|
| **二分法** (Bisection) | 线性 | 稳定可靠 | 需要区间，保证收敛 |
| **牛顿法** (Newton) | 二次 | 收敛最快 | 需要导数，初值敏感 |
| **埃特肯法** (Aitken) | 二次 | 加速收敛 | 适合慢收敛序列 |
| **弦截法** (Secant) | 超线性 (φ≈1.618) | 无需导数 | 平衡速度和简单性 |

### 🎯 核心可视化

#### 1. 函数曲线绘制
- 使用 D3.js 动态渲染
- 渐变色彩美化
- 实时标注迭代点
- 显示切线/割线

#### 2. 收敛速度分析
- 对数坐标误差图
- 实时收敛率计算
- 误差下降可视化

#### 3. 收敛盆热力图
- 不同初值的收敛分析
- 彩色热力图展示
- 实时计算进度

#### 4. 详细数据表格
- 完整迭代历史
- 高亮当前步骤
- 响应式设计

### 🎮 交互控制

- ⏮ ⏪ ▶ ⏸ ⏩ ⏭ **完整播放控制**
- 🎚️ **速度调节** (0.1x - 3.0x)
- 📊 **进度条跳转**
- 📥 **数据导出** (CSV/JSON)

---

## 📦 技术栈

```
Frontend Framework:  React 18
Build Tool:          Vite
Styling:             Tailwind CSS
Visualization:       D3.js v7
Math Parser:         math.js
```

### 🏗️ 项目架构

```
numerical-analysis-platform/
├── demo-modern.html              # 现代风格设计 Demo
├── demo-scientific.html          # 科学仪器风格 Demo
└── numerical-visualizer/         # 主项目
    ├── src/
    │   ├── algorithms/          # 算法核心实现
    │   │   ├── bisection.js    # 二分法
    │   │   ├── newton.js       # 牛顿法
    │   │   ├── aitken.js       # 埃特肯法
    │   │   ├── secant.js       # 弦截法
    │   │   └── index.js        # 算法配置
    │   │
    │   ├── components/          # React 组件
    │   │   ├── FunctionInput.jsx
    │   │   ├── AnimationController.jsx
    │   │   ├── FunctionPlot.jsx
    │   │   ├── ConvergenceChart.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── BasinPlot.jsx
    │   │   └── ExportButton.jsx
    │   │
    │   ├── App.jsx             # 主应用
    │   ├── index.css           # Tailwind + 全局样式
    │   └── main.jsx            # 入口文件
    │
    ├── tailwind.config.js      # Tailwind 配置
    ├── vite.config.js          # Vite 配置
    ├── package.json
    ├── README.md               # 项目文档
    ├── PREVIEW.md              # 设计说明
    └── USAGE.md                # 使用指南
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

点击左侧面板的算法按钮，选择四种算法之一。

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

- **初值 (x₀)**: 算法起始点
- **容许误差**: 收敛判断阈值
- **最大迭代次数**: 防止无限循环

### 4️⃣ 观察可视化

- 自动开始计算
- 使用播放控制器观察动画
- 查看实时图表和数据

### 5️⃣ 导出数据

点击 **CSV** 或 **JSON** 按钮导出完整迭代数据。

---

## 🎨 设计系统

采用现代化轻量级css系统——tailwindcss，使得整个项目更加轻盈的同时依然能够具有较美观的ui设计。

## 📚 文档

- 📘 [完整项目文档](./numerical-visualizer/README.md)
- 🎨 [设计预览说明](./numerical-visualizer/PREVIEW.md)
- 📖 [详细使用指南](./numerical-visualizer/USAGE.md)

---

## 🌟 特色亮点

### 教学价值

- ✅ **直观展示** - 动画演示算法每一步
- ✅ **对比分析** - 不同算法收敛速度对比
- ✅ **数据详实** - 完整的迭代数据记录
- ✅ **交互式学习** - 自由调整参数观察变化

### 技术亮点

- ⚡ **高性能** - Vite 极速构建
- 🎨 **现代设计** - Tailwind CSS 美化
- 📊 **强大可视化** - D3.js 专业图表
- 📱 **响应式** - 完美适配各种设备

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 🙏 技术栈

- [React](https://reactjs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [D3.js](https://d3js.org/) - 数据可视化
- [math.js](https://mathjs.org/) - 数学库

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ by Sophie618

</div>
