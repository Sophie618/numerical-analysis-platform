import { useState, useEffect, useCallback } from 'react';
import FunctionInput from './components/FunctionInput';
import AnimationController from './components/AnimationController';
import FunctionPlot from './components/FunctionPlot';
import ConvergenceChart from './components/ConvergenceChart';
import DataTable from './components/DataTable';
import ExportButton from './components/ExportButton';
import { bisection, newton, aitken, secant, createIterationFunction, PRESET_FUNCTIONS, ALGORITHMS } from './algorithms';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bisection');
  const [currentFunction, setCurrentFunction] = useState({
    f: PRESET_FUNCTIONS[0].f,
    df: PRESET_FUNCTIONS[0].df,
    expression: PRESET_FUNCTIONS[0].expression,
    name: PRESET_FUNCTIONS[0].name
  });
  const [parameters, setParameters] = useState({
    x0: 1.0,
    x1: 2.0,
    tolerance: 0.0001,
    maxIterations: 50
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const runAlgorithm = useCallback(() => {
    if (!currentFunction.f) return;
    try {
      let algorithmResult;
      switch (selectedAlgorithm) {
        case 'bisection':
          algorithmResult = bisection(currentFunction.f, parameters.x0, parameters.x1, parameters.tolerance, parameters.maxIterations);
          break;
        case 'newton':
          algorithmResult = newton(currentFunction.f, currentFunction.df, parameters.x0, parameters.tolerance, parameters.maxIterations);
          break;
        case 'aitken':
          const g = createIterationFunction(currentFunction.f, 0.1);
          algorithmResult = aitken(g, parameters.x0, parameters.tolerance, parameters.maxIterations);
          break;
        case 'secant':
          algorithmResult = secant(currentFunction.f, parameters.x0, parameters.x1, parameters.tolerance, parameters.maxIterations);
          break;
        default:
          return;
      }
      setResult(algorithmResult);
      setHistory(algorithmResult.history);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (error) {
      alert('算法执行错误: ' + error.message);
      console.error(error);
    }
  }, [selectedAlgorithm, currentFunction, parameters]);

  useEffect(() => {
    runAlgorithm();
  }, [runAlgorithm]);

  useEffect(() => {
    if (!isPlaying || !history || history.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= history.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, history]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="glass rounded-3xl p-6 sm:p-8 mb-6 shadow-xl border border-white/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Numerical Analysis Visualizer
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">迭代求根算法可视化系统</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium text-slate-700">实时计算中</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 mb-6">
        {/* Left Panel */}
        <aside className="space-y-6">
          {/* Algorithm Selection */}
          <div className="glass rounded-3xl p-6 shadow-xl border border-white/40">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">算法选择</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(ALGORITHMS).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedAlgorithm(key)}
                  className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    selectedAlgorithm === key
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {ALGORITHMS[key].displayName}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600 bg-blue-50/50 rounded-xl p-3">
              {ALGORITHMS[selectedAlgorithm].description}
            </p>
          </div>

          {/* Function Input */}
          <FunctionInput
            onFunctionChange={setCurrentFunction}
            onParametersChange={setParameters}
          />

          {/* Animation Controller */}
          <AnimationController
            currentStep={currentStep}
            totalSteps={history.length}
            onStepChange={setCurrentStep}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          {/* Results */}
          {result && (
            <div className="glass rounded-3xl p-6 shadow-xl border border-white/40">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">计算结果</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">根</span>
                  <span className="text-sm font-mono font-bold text-blue-600">{result.root.toFixed(8)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">f(root)</span>
                  <span className="text-sm font-mono font-bold text-purple-600">
                    {result.fx ? result.fx.toExponential(4) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">迭代次数</span>
                  <span className="text-sm font-mono font-bold text-emerald-600">{result.iterations}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">收敛状态</span>
                  <span className={`text-sm font-bold ${result.converged ? 'text-green-600' : 'text-red-600'}`}>
                    {result.converged ? '✓ 已收敛' : '✗ 未收敛'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Export */}
          <div className="glass rounded-3xl p-6 shadow-xl border border-white/40">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">数据导出</h2>
            <ExportButton
              history={history}
              result={result}
              method={ALGORITHMS[selectedAlgorithm].name}
              functionName={currentFunction.name}
            />
          </div>
        </aside>

        {/* Right Panel - Visualizations */}
        <main className="space-y-6">
          <FunctionPlot
            func={currentFunction.f}
            history={history}
            currentStep={currentStep}
            method={ALGORITHMS[selectedAlgorithm].name}
            xRange={[parameters.x0 - 2, parameters.x1 + 2]}
          />
          <ConvergenceChart history={history} currentStep={currentStep} />
          <DataTable
            history={history}
            currentStep={currentStep}
            method={ALGORITHMS[selectedAlgorithm].name}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
