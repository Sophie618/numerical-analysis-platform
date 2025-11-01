import { useState, useEffect } from 'react';
import './ThemeToggle.css';

/**
 * 主题切换组件
 */
function ThemeToggle() {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('theme') || 'modern';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    if (themeName === 'scientific') {
      document.body.classList.add('theme-scientific');
    } else {
      document.body.classList.remove('theme-scientific');
    }
    localStorage.setItem('theme', themeName);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'modern' ? 'scientific' : 'modern';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
      <span className="theme-icon">
        {theme === 'modern' ? '🎨' : '🔬'}
      </span>
      <span className="theme-label">
        {theme === 'modern' ? '现代风格' : '科学仪器'}
      </span>
    </button>
  );
}

export default ThemeToggle;

