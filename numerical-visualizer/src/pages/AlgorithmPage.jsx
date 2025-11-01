import { useState, useEffect, useCallback } from 'react';
import FunctionInput from '../components/FunctionInput';
import AnimationController from '../components/AnimationController';
import FunctionPlot from '../components/FunctionPlot';
import ConvergenceChart from '../components/ConvergenceChart';
import DataTable from '../components/DataTable';
import ExportButton from '../components/ExportButton';
import { bisection, newton, aitken, secant, createIterationFunction, PRESET_FUNCTIONS, ALGORITHMS } from '../algorithms';

function AlgorithmPage({ algorithmKey }) {
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
      switch (algorithmKey) {
        case 'bisection':
          algorithmResult = bisection(currentFunction.f, parameters.x0, parameters.x1, parameters.tolerance, parameters.maxIterations);
          break;
        case 'newton':
          algorithmResult = newton(currentFunction.f, currentFunction.df, parameters.x0, parameters.tolerance, parameters.maxIterations);
          break;
        case 'aitken': {
          const g = createIterationFunction(currentFunction.f, 0.1);
          algorithmResult = aitken(g, parameters.x0, parameters.tolerance, parameters.maxIterations);
          break;
        }
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
  }, [algorithmKey, currentFunction, parameters]);

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

  const algorithm = ALGORITHMS[algorithmKey];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                {algorithm.displayName}
              </h2>
              <p className="text-neutral-600">{algorithm.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-neutral-500">收敛阶</div>
                <div className="text-2xl font-bold text-primary-600">{algorithm.convergenceOrder}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Panel */}
          <aside className="space-y-6">
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
              <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">计算结果</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border border-primary-200">
                    <span className="text-sm font-medium text-neutral-700">根</span>
                    <span className="text-sm font-mono font-bold text-primary-700">{result.root.toFixed(8)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-secondary-50 to-secondary-100/50 rounded-xl border border-secondary-200">
                    <span className="text-sm font-medium text-neutral-700">f(root)</span>
                    <span className="text-sm font-mono font-bold text-secondary-700">
                      {result.fx ? result.fx.toExponential(4) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-neutral-200">
                    <span className="text-sm font-medium text-neutral-700">迭代次数</span>
                    <span className="text-sm font-mono font-bold text-neutral-800">{result.iterations}</span>
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

            {/* Export */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">数据导出</h3>
              <ExportButton
                history={history}
                result={result}
                method={algorithm.name}
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
              method={algorithm.name}
              xRange={[parameters.x0 - 2, parameters.x1 + 2]}
            />
            <ConvergenceChart history={history} currentStep={currentStep} />
            <DataTable
              history={history}
              currentStep={currentStep}
              method={algorithm.name}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmPage;

