import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import FunctionPlot from '../components/FunctionPlot';
import ConvergenceChart from '../components/ConvergenceChart';
import DataTable from '../components/DataTable';
import { bisection, newton, aitken, secant, createIterationFunction, ALGORITHMS } from '../algorithms';
import { useSettings } from '../context/SettingsContext';

function AlgorithmPage({ algorithmKey }) {
  const { currentFunction, parameters } = useSettings();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const runAlgorithm = useCallback(() => {
    if (!currentFunction.f) return;
    
    // 参数验证
    try {
      if (parameters.tolerance <= 0) {
        alert('容许误差必须大于 0');
        return;
      }
      if (parameters.maxIterations <= 0) {
        alert('最大迭代次数必须大于 0');
        return;
      }
      
      // 二分法和弦截法需要检查区间
      if (algorithmKey === 'bisection' || algorithmKey === 'secant') {
        if (parameters.x0 === parameters.x1) {
          alert('二分法和弦截法需要两个不同的初值');
          return;
        }
      }
      
      // 牛顿法需要检查导数
      if (algorithmKey === 'newton' && !currentFunction.df) {
        alert('牛顿法需要函数的导数，请选择预设函数或重新输入自定义函数');
        return;
      }

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
      <div className="flex">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] w-full">
          {/* Left Sidebar */}
          <Sidebar
            currentStep={currentStep}
            history={history}
            onStepChange={setCurrentStep}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            speed={speed}
            onSpeedChange={setSpeed}
            result={result}
            algorithmName={algorithm.name}
          />

          {/* Right Panel - Visualizations */}
          <main className="p-6">
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* Page Header */}
              <div className="p-6">
                <div className="flex items-center gap-12">
                  <div>
                    <h2 className="text-4xl font-bold text-secondary-500 mb-2">
                      {algorithm.displayName}
                    </h2>
                    <p className="text-lg text-neutral-600">{algorithm.description}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg text-neutral-500">收敛阶</div>
                    <div className="text-2xl font-bold text-primary-600">{algorithm.convergenceOrder}</div>
                  </div>
                </div>
              </div>

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
              method={algorithm.name}
            />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmPage;

