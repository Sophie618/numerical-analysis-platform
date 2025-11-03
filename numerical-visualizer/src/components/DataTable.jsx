function DataTable({ history, method }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass rounded-3xl p-6 shadow-xl border border-white/40">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">迭代数据表</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-slate-600 font-medium">暂无数据</p>
          <p className="text-slate-400 text-sm mt-2">请选择算法和函数开始计算</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    if (!isFinite(num)) return 'Inf';
    return num.toFixed(6);
  };

  const formatInterval = (interval) => {
    if (!interval) return '-';
    return `[${interval[0].toFixed(4)}, ${interval[1].toFixed(4)}]`;
  };

  const renderHeaders = () => {
    switch (method) {
      case 'Bisection':
        return (
          <>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">步数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">f(x<sub>n</sub>)</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">区间</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">误差</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">收敛率</th>
          </>
        );
      case 'Newton':
        const hasLambda = history.some(item => item.lambda !== undefined && item.lambda !== 1.0);
        return (
          <>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">步数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">f(x<sub>n</sub>)</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">f'(x<sub>n</sub>)</th>
            {hasLambda && <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">λ</th>}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n+1</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">误差</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">收敛率</th>
          </>
        );
      case 'Aitken':
        return (
          <>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">步数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n+1</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n+2</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x̂<sub>n</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">误差</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">收敛率</th>
          </>
        );
      case 'Secant':
        return (
          <>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">步数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n-1</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">f(x<sub>n</sub>)</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">x<sub>n+1</sub></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">误差</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">收敛率</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderRows = () => {
    return history.map((item, index) => {
      const cells = (() => {
        switch (method) {
          case 'Bisection':
            return (
              <>
                <td className="px-4 py-3">{item.iteration}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.fx)}</td>
                <td className="px-4 py-3 font-mono text-xs">{formatInterval(item.interval)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.error)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.convergenceRate)}</td>
              </>
            );
          case 'Newton':
            const showLambda = history.some(h => h.lambda !== undefined && h.lambda !== 1.0);
            return (
              <>
                <td className="px-4 py-3">{item.iteration}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.fx)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.dfx)}</td>
                {showLambda && (
                  <td className="px-4 py-3 font-mono text-sm">
                    <span className={item.lambda < 1.0 ? 'text-orange-600 font-bold' : ''}>
                      {item.lambda ? item.lambda.toFixed(4) : '1.0000'}
                    </span>
                    {item.dampingAttempts && item.dampingAttempts.length > 1 && (
                      <span className="ml-1 text-xs text-slate-500">({item.dampingAttempts.length}次)</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.xNext)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.error)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.convergenceRate)}</td>
              </>
            );
          case 'Aitken':
            return (
              <>
                <td className="px-4 py-3">{item.iteration}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x1)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x2)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.xHat)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.error)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.convergenceRate)}</td>
              </>
            );
          case 'Secant':
            return (
              <>
                <td className="px-4 py-3">{item.iteration}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.xPrev)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.x)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.fx)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.xNext)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.error)}</td>
                <td className="px-4 py-3 font-mono text-sm">{formatNumber(item.convergenceRate)}</td>
              </>
            );
          default:
            return null;
        }
      })();

      return (
        <tr
          key={index}
          className="border-t border-neutral-200/50 transition-all hover:bg-secondary-100/40 hover:border-l-4 hover:border-l-secondary-500 cursor-pointer"
        >
          {cells}
        </tr>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200">
      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">迭代数据表</h2>
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-2xl bg-neutral-50/50 border border-neutral-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-neutral-100 to-neutral-200 sticky top-0">
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody className="text-slate-700">
            {renderRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
