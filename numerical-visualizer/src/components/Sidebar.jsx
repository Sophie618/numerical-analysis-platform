import FunctionInput from './FunctionInput';
import AnimationController from './AnimationController';
import ExportButton from './ExportButton';
import { useSettings } from '../context/SettingsContext';

function Sidebar({ 
  currentStep, 
  history, 
  onStepChange, 
  isPlaying, 
  onPlayPause, 
  speed, 
  onSpeedChange, 
  result,
  algorithmName
}) {
  const { currentFunction, useNewtonDamping, setUseNewtonDamping } = useSettings();
  const isNewtonMethod = algorithmName === 'Newton';

  return (
    <aside className="bg-white min-h-screen shadow-lg border-r border-neutral-200 overflow-y-auto">
      <div>
        {/* Function Input Section */}
        <div className="p-6 border-b border-neutral-200">
          <FunctionInput />
        </div>

        {/* Newton Damping Toggle */}
        {isNewtonMethod && (
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">算法选项</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useNewtonDamping}
                  onChange={(e) => setUseNewtonDamping(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-secondary-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-700 group-hover:text-secondary-600 transition-colors">
                  启用下山条件
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  保证 |f(x_{'{n+1}'})| {'<'} |f(x_n)|
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Animation Controller Section */}
        <div className="p-6 border-b border-neutral-200">
          <AnimationController
            currentStep={currentStep}
            totalSteps={history.length}
            onStepChange={onStepChange}
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            speed={speed}
            onSpeedChange={onSpeedChange}
          />
        </div>

        {/* Results Section */}
        {result && (
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">计算结果</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl border border-secondary-200">
                <span className="text-sm font-medium text-neutral-700">根</span>
                <span className="text-sm font-mono font-bold text-secondary-700">{result.root.toFixed(8)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-xl border border-primary-200">
                <span className="text-sm font-medium text-neutral-700">f(root)</span>
                <span className="text-sm font-mono font-bold text-primary-700">
                  {result.fx ? result.fx.toExponential(4) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl border border-secondary-200">
                <span className="text-sm font-medium text-neutral-700">迭代次数</span>
                <span className="text-sm font-mono font-bold text-secondary-700">{result.iterations}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-sm font-medium text-neutral-700">收敛状态</span>
                <span className={`text-sm font-bold ${result.converged ? 'text-secondary-600' : 'text-red-600'}`}>
                  {result.converged ? '✓ 已收敛' : '✗ 未收敛'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">数据导出</h3>
          <ExportButton
            history={history}
            result={result}
            method={algorithmName}
            functionName={currentFunction.name}
          />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

