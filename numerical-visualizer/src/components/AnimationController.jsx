import { useState, useEffect } from 'react';

function AnimationController({ currentStep, totalSteps, onStepChange, isPlaying, onPlayPause, speed, onSpeedChange }) {
  const [localSpeed, setLocalSpeed] = useState(speed || 1.0);

  useEffect(() => {
    setLocalSpeed(speed || 1.0);
  }, [speed]);

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setLocalSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">动画控制</h2>
      
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-5 space-y-4 border border-neutral-200">
        {/* Step Indicator */}
        <div className="text-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {currentStep + 1}
          </span>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-xl font-semibold text-neutral-600">{totalSteps}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => onStepChange(0)}
            disabled={currentStep === 0 || totalSteps === 0}
            className="p-3 rounded-xl bg-white/80 text-slate-700 hover:bg-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            ⏮
          </button>
          <button 
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || totalSteps === 0}
            className="p-3 rounded-xl bg-white/80 text-slate-700 hover:bg-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            ⏪
          </button>
          <button 
            onClick={onPlayPause}
            disabled={totalSteps === 0}
            className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
            className="p-3 rounded-xl bg-white/80 text-slate-700 hover:bg-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            ⏩
          </button>
          <button 
            onClick={() => onStepChange(totalSteps - 1)}
            disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
            className="p-3 rounded-xl bg-white/80 text-slate-700 hover:bg-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            ⏭
          </button>
        </div>

        {/* Progress Bar */}
        <div 
          onClick={(e) => {
            if (totalSteps > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              const newStep = Math.floor(percentage * totalSteps);
              onStepChange(Math.max(0, Math.min(newStep, totalSteps - 1)));
            }
          }}
          className="h-2 bg-white/60 rounded-full overflow-hidden cursor-pointer hover:h-3 transition-all"
        >
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600 w-10">速度</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={localSpeed}
            onChange={handleSpeedChange}
            disabled={totalSteps === 0}
            className="flex-1 h-2 bg-white/60 rounded-full appearance-none cursor-pointer disabled:opacity-40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform"
          />
          <span className="text-sm font-bold text-primary-600 w-12 text-right">{localSpeed.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}

export default AnimationController;
