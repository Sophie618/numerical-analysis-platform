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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
              NA
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-800">数值分析可视化平台</h1>
              <p className="text-xs text-neutral-500">Numerical Analysis Visualizer</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
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

