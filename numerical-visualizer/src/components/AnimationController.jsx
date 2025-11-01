import { useState, useEffect } from 'react';
import './AnimationController.css';

/**
 * 动画控制器组件
 * 提供播放/暂停/单步前进/后退/速度控制功能
 */
function AnimationController({ 
  currentStep, 
  totalSteps, 
  onStepChange, 
  isPlaying, 
  onPlayPause,
  speed,
  onSpeedChange 
}) {
  const [localSpeed, setLocalSpeed] = useState(speed || 1.0);

  useEffect(() => {
    setLocalSpeed(speed || 1.0);
  }, [speed]);

  // 跳转到第一步
  const handleFirst = () => {
    onStepChange(0);
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  // 下一步
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  // 跳转到最后一步
  const handleLast = () => {
    onStepChange(totalSteps - 1);
  };

  // 播放/暂停
  const handlePlayPause = () => {
    onPlayPause();
  };

  // 速度调整
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setLocalSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  // 进度条点击跳转
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newStep = Math.floor(percentage * totalSteps);
    onStepChange(Math.max(0, Math.min(newStep, totalSteps - 1)));
  };

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="animation-controller">
      <div className="panel-section">
        <div className="section-title">动画控制</div>
        
        <div className="animation-controls">
          <div className="step-indicator">
            <span className="step-current">{currentStep + 1}</span>
            <span className="step-separator">/</span>
            <span className="step-total">{totalSteps}</span>
          </div>

          <div className="control-buttons">
            <button 
              className="control-btn" 
              onClick={handleFirst}
              disabled={currentStep === 0 || totalSteps === 0}
              title="第一步"
            >
              ⏮
            </button>
            <button 
              className="control-btn" 
              onClick={handlePrevious}
              disabled={currentStep === 0 || totalSteps === 0}
              title="上一步"
            >
              ⏪
            </button>
            <button 
              className="control-btn play-btn" 
              onClick={handlePlayPause}
              disabled={totalSteps === 0}
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button 
              className="control-btn" 
              onClick={handleNext}
              disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
              title="下一步"
            >
              ⏩
            </button>
            <button 
              className="control-btn" 
              onClick={handleLast}
              disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
              title="最后一步"
            >
              ⏭
            </button>
          </div>

          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
            style={{ cursor: totalSteps > 0 ? 'pointer' : 'default' }}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="speed-control">
            <span className="speed-label">速度</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={localSpeed}
              onChange={handleSpeedChange}
              disabled={totalSteps === 0}
            />
            <span className="speed-value">{localSpeed.toFixed(1)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimationController;

