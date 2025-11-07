import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/bisection', label: '二分法' },
    { path: '/aitken', label: '埃特肯法' },
    { path: '/newton', label: '牛顿法' },
    { path: '/secant', label: '双点弦截法' },
    { path: '/ai-tutor', label: '智能体伴学' }, // 新增：智能体伴学
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-xl transition-shadow">
              <img src="/bit.png" alt="Logo" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">数值分析迭代求根可视化平台</h1>
              <p className="text-xs text-neutral-500">Numerical Analysis Iterative Root Visualizer</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center justify-center gap-6 mx-auto">
            {navItems.map((item, index) => {
              const underlineColor = index % 2 === 0 ? 'border-secondary-500' : 'border-primary-500';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 py-2 font-medium text-lg transition-all border-b-2 ${isActive(item.path)
                      ? `${underlineColor} text-neutral-900`
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;