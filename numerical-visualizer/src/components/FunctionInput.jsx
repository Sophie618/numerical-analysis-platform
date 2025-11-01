import { useState } from 'react';
import { create, all } from 'mathjs';
import { PRESET_FUNCTIONS } from '../algorithms';

const math = create(all);

function FunctionInput({ onFunctionChange, onParametersChange }) {
  const [selectedPreset, setSelectedPreset] = useState('quadratic');
  const [customExpression, setCustomExpression] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [parameters, setParameters] = useState({
    x0: 1.0,
    x1: 2.0,
    tolerance: 0.0001,
    maxIterations: 50
  });
  const [parseError, setParseError] = useState('');

  const handlePresetChange = (e) => {
    const presetId = e.target.value;
    if (presetId === 'custom') {
      setUseCustom(true);
      setSelectedPreset('custom');
    } else {
      setUseCustom(false);
      setSelectedPreset(presetId);
      const preset = PRESET_FUNCTIONS.find(p => p.id === presetId);
      if (preset) {
        setParameters(prev => ({
          ...prev,
          x0: preset.suggestedInterval[0],
          x1: preset.suggestedInterval[1]
        }));
        onFunctionChange({
          f: preset.f,
          df: preset.df,
          expression: preset.expression,
          name: preset.name
        });
      }
    }
  };

  const handleCustomExpressionChange = (e) => {
    const expr = e.target.value;
    setCustomExpression(expr);
    if (expr.trim() === '') {
      setParseError('');
      return;
    }
    try {
      const node = math.parse(expr);
      const compiled = node.compile();
      const f = (x) => {
        try {
          return compiled.evaluate({ x: x });
        } catch {
          return NaN;
        }
      };
      const df = (x) => {
        const h = 1e-6;
        return (f(x + h) - f(x - h)) / (2 * h);
      };
      const testValue = f(1);
      if (isNaN(testValue) || !isFinite(testValue)) {
        throw new Error('函数计算结果无效');
      }
      setParseError('');
      onFunctionChange({ f, df, expression: expr, name: '自定义函数' });
    } catch (err) {
      setParseError('表达式解析错误: ' + err.message);
    }
  };

  const handleParameterChange = (key, value) => {
    const newParameters = { ...parameters, [key]: parseFloat(value) };
    setParameters(newParameters);
    onParametersChange(newParameters);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">函数设置</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">预设函数</label>
            <select 
              value={selectedPreset}
              onChange={handlePresetChange}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {PRESET_FUNCTIONS.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
              <option value="custom">自定义函数</option>
            </select>
          </div>

          {useCustom && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">自定义表达式</label>
              <input
                type="text"
                value={customExpression}
                onChange={handleCustomExpressionChange}
                placeholder="例如: x^2 - 2"
                className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  parseError ? 'border-red-300 focus:ring-red-500' : 'border-neutral-300'
                }`}
              />
              {parseError && (
                <p className="mt-2 text-xs text-red-600">{parseError}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                支持: +, -, *, /, ^, sqrt(), sin(), cos(), exp(), log() 等
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">参数设置</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">初值 / 区间起点 (x₀)</label>
            <input
              type="number"
              value={parameters.x0}
              step="0.1"
              onChange={(e) => handleParameterChange('x0', e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">第二个初值 / 区间终点 (x₁)</label>
            <input
              type="number"
              value={parameters.x1}
              step="0.1"
              onChange={(e) => handleParameterChange('x1', e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">容许误差</label>
            <input
              type="number"
              value={parameters.tolerance}
              step="0.0001"
              onChange={(e) => handleParameterChange('tolerance', e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">最大迭代次数</label>
            <input
              type="number"
              value={parameters.maxIterations}
              min="1"
              max="200"
              onChange={(e) => handleParameterChange('maxIterations', e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionInput;
