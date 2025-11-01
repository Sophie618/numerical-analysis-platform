import { Link } from 'react-router-dom';

function Home() {
  const algorithms = [
    {
      id: 'bisection',
      name: '二分法',
      nameEn: 'Bisection Method',
      description: '通过不断二分区间来逼近根，稳定可靠，适用于连续函数',
      convergence: '线性收敛',
      icon: '📊',
      color: 'bg-secondary-500',
      features: ['稳定可靠', '需要区间', '保证收敛']
    },
    {
      id: 'newton',
      name: '牛顿法',
      nameEn: 'Newton Method',
      description: '使用函数的切线逼近根，收敛速度最快，需要导数信息',
      convergence: '二次收敛',
      icon: '🚀',
      color: 'bg-primary-500',
      features: ['收敛最快', '需要导数', '初值敏感']
    },
    {
      id: 'aitken',
      name: '埃特肯法',
      nameEn: 'Aitken Method',
      description: '加速线性收敛序列的方法，适合慢收敛序列的加速',
      convergence: '二次收敛',
      icon: '⚡',
      color: 'bg-secondary-500',
      features: ['加速收敛', '不需导数', '适合迭代']
    },
    {
      id: 'secant',
      name: '弦截法',
      nameEn: 'Secant Method',
      description: '使用割线代替切线，不需要导数，是牛顿法的变形',
      convergence: '超线性收敛',
      icon: '📈',
      color: 'bg-primary-500',
      features: ['无需导数', '超线性', '平衡方案']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="max-w-[1800px] mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            探索数值分析迭代求根方法
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            通过交互式可视化，深入理解四种经典求根算法的原理与应用
          </p>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary-600">4</span>
              <span className="text-neutral-600">种算法</span>
            </div>
            <div className="w-px h-12 bg-neutral-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-secondary-600">∞</span>
              <span className="text-neutral-600">个函数</span>
            </div>
            <div className="w-px h-12 bg-neutral-300"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary-600">100%</span>
              <span className="text-neutral-600">可视化</span>
            </div>
          </div>
        </div>

        {/* Algorithm Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {algorithms.map((algo) => (
            <Link
              key={algo.id}
              to={`/${algo.id}`}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200 hover:border-primary-300"
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl ${algo.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {algo.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-neutral-800">{algo.name}</h3>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                      {algo.convergence}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3">{algo.nameEn}</p>
                  <p className="text-neutral-600 mb-4 leading-relaxed">{algo.description}</p>
                  <div className="flex gap-2">
                    {algo.features.map((feature, index) => {
                      // 交替使用绿色和橙色浅色背景
                      const bgColor = index % 2 === 0 ? 'bg-secondary-50' : 'bg-primary-50';
                      return (
                        <span
                          key={index}
                          className={`px-3 py-1 ${bgColor} text-xs font-medium text-neutral-700 rounded-lg`}
                        >
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-primary-500 group-hover:translate-x-2 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
              🎯
            </div>
            <h4 className="text-lg font-bold text-neutral-800 mb-2">实时动画</h4>
            <p className="text-neutral-600 text-sm">逐步观察算法的每一次迭代，深入理解收敛过程</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
              📊
            </div>
            <h4 className="text-lg font-bold text-neutral-800 mb-2">图表分析</h4>
            <p className="text-neutral-600 text-sm">函数曲线、收敛速度、详细数据表格一目了然</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
              ⚙️
            </div>
            <h4 className="text-lg font-bold text-neutral-800 mb-2">自定义函数</h4>
            <p className="text-neutral-600 text-sm">支持预设函数和自定义数学表达式输入</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

