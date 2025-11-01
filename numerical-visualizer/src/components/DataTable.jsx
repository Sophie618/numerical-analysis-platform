import './DataTable.css';

/**
 * 数据表格组件
 * 显示迭代过程的详细数据
 */
function DataTable({ history, currentStep, method }) {
  if (!history || history.length === 0) {
    return (
      <div className="data-table-container">
        <div className="chart-title">迭代数据表</div>
        <div className="empty-state">
          <p>暂无数据</p>
          <p className="empty-hint">请选择算法和函数开始计算</p>
        </div>
      </div>
    );
  }

  // 根据不同算法显示不同的列
  const renderTableHeaders = () => {
    switch (method) {
      case 'Bisection':
        return (
          <tr>
            <th>步数</th>
            <th>x<sub>n</sub></th>
            <th>f(x<sub>n</sub>)</th>
            <th>区间</th>
            <th>误差</th>
            <th>收敛率</th>
          </tr>
        );
      case 'Newton':
        return (
          <tr>
            <th>步数</th>
            <th>x<sub>n</sub></th>
            <th>f(x<sub>n</sub>)</th>
            <th>f'(x<sub>n</sub>)</th>
            <th>x<sub>n+1</sub></th>
            <th>误差</th>
            <th>收敛率</th>
          </tr>
        );
      case 'Aitken':
        return (
          <tr>
            <th>步数</th>
            <th>x<sub>n</sub></th>
            <th>x<sub>n+1</sub></th>
            <th>x<sub>n+2</sub></th>
            <th>x̂<sub>n</sub></th>
            <th>误差</th>
            <th>收敛率</th>
          </tr>
        );
      case 'Secant':
        return (
          <tr>
            <th>步数</th>
            <th>x<sub>n-1</sub></th>
            <th>x<sub>n</sub></th>
            <th>f(x<sub>n</sub>)</th>
            <th>x<sub>n+1</sub></th>
            <th>误差</th>
            <th>收敛率</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return history.map((item, index) => {
      const isActive = index === currentStep;
      
      const formatNumber = (num) => {
        if (num === null || num === undefined) return '-';
        if (!isFinite(num)) return 'Inf';
        return num.toFixed(6);
      };

      const formatInterval = (interval) => {
        if (!interval) return '-';
        return `[${interval[0].toFixed(4)}, ${interval[1].toFixed(4)}]`;
      };

      switch (method) {
        case 'Bisection':
          return (
            <tr key={index} className={isActive ? 'active' : ''}>
              <td>{item.iteration}</td>
              <td>{formatNumber(item.x)}</td>
              <td>{formatNumber(item.fx)}</td>
              <td className="interval-cell">{formatInterval(item.interval)}</td>
              <td>{formatNumber(item.error)}</td>
              <td>{formatNumber(item.convergenceRate)}</td>
            </tr>
          );
        case 'Newton':
          return (
            <tr key={index} className={isActive ? 'active' : ''}>
              <td>{item.iteration}</td>
              <td>{formatNumber(item.x)}</td>
              <td>{formatNumber(item.fx)}</td>
              <td>{formatNumber(item.dfx)}</td>
              <td>{formatNumber(item.xNext)}</td>
              <td>{formatNumber(item.error)}</td>
              <td>{formatNumber(item.convergenceRate)}</td>
            </tr>
          );
        case 'Aitken':
          return (
            <tr key={index} className={isActive ? 'active' : ''}>
              <td>{item.iteration}</td>
              <td>{formatNumber(item.x)}</td>
              <td>{formatNumber(item.x1)}</td>
              <td>{formatNumber(item.x2)}</td>
              <td>{formatNumber(item.xHat)}</td>
              <td>{formatNumber(item.error)}</td>
              <td>{formatNumber(item.convergenceRate)}</td>
            </tr>
          );
        case 'Secant':
          return (
            <tr key={index} className={isActive ? 'active' : ''}>
              <td>{item.iteration}</td>
              <td>{formatNumber(item.xPrev)}</td>
              <td>{formatNumber(item.x)}</td>
              <td>{formatNumber(item.fx)}</td>
              <td>{formatNumber(item.xNext)}</td>
              <td>{formatNumber(item.error)}</td>
              <td>{formatNumber(item.convergenceRate)}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="data-table-container">
      <div className="chart-title">迭代数据表</div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

