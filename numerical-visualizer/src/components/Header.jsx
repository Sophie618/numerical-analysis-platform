import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/bisection', label: '二分法' },
    { path: '/newton', label: '牛顿法' },
    { path: '/aitken', label: '埃特肯法' },
    { path: '/secant', label: '弦截法' },
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
            <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
              NA
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">数值分析可视化平台</h1>
              <p className="text-xs text-neutral-500">Numerical Analysis Visualizer</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map((item, index) => {
              // 交替使用绿色和橙色：首页-绿、二分法-橙、牛顿法-绿、埃特肯法-橙、弦截法-绿
              const underlineColor = index % 2 === 0 ? 'border-secondary-500' : 'border-primary-500';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 py-2 font-medium text-sm transition-all border-b-2 ${
                    isActive(item.path)
                      ? `${underlineColor} text-neutral-900`
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium text-neutral-700">在线</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

