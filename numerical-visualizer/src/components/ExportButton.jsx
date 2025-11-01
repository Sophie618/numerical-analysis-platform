import './ExportButton.css';

/**
 * 数据导出按钮组件
 */
function ExportButton({ history, result, method, functionName }) {
  const exportToCSV = () => {
    if (!history || history.length === 0) {
      alert('没有可导出的数据');
      return;
    }

    let csvContent = '';
    
    // 添加元数据
    csvContent += `算法,${method}\n`;
    csvContent += `函数,${functionName}\n`;
    if (result) {
      csvContent += `根,${result.root}\n`;
      csvContent += `f(根),${result.fx || 'N/A'}\n`;
      csvContent += `迭代次数,${result.iterations}\n`;
      csvContent += `收敛状态,${result.converged ? '已收敛' : '未收敛'}\n`;
    }
    csvContent += '\n';

    // 根据不同算法生成不同的表头和数据
    switch (method) {
      case 'Bisection':
        csvContent += '步数,x_n,f(x_n),区间左端点,区间右端点,误差,收敛率\n';
        history.forEach(item => {
          csvContent += `${item.iteration},${item.x},${item.fx},${item.interval[0]},${item.interval[1]},${item.error},${item.convergenceRate || ''}\n`;
        });
        break;
      
      case 'Newton':
        csvContent += '步数,x_n,f(x_n),f\'(x_n),x_n+1,误差,收敛率\n';
        history.forEach(item => {
          csvContent += `${item.iteration},${item.x},${item.fx},${item.dfx},${item.xNext},${item.error},${item.convergenceRate || ''}\n`;
        });
        break;
      
      case 'Aitken':
        csvContent += '步数,x_n,x_n+1,x_n+2,x̂_n,误差,收敛率\n';
        history.forEach(item => {
          csvContent += `${item.iteration},${item.x},${item.x1},${item.x2},${item.xHat},${item.error},${item.convergenceRate || ''}\n`;
        });
        break;
      
      case 'Secant':
        csvContent += '步数,x_n-1,x_n,f(x_n),x_n+1,误差,收敛率\n';
        history.forEach(item => {
          csvContent += `${item.iteration},${item.xPrev},${item.x},${item.fx},${item.xNext},${item.error},${item.convergenceRate || ''}\n`;
        });
        break;
    }

    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${method}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (!history || history.length === 0) {
      alert('没有可导出的数据');
      return;
    }

    const data = {
      algorithm: method,
      function: functionName,
      result: result,
      history: history,
      exportTime: new Date().toISOString()
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${method}_${Date.now()}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="export-button-group">
      <button 
        className="export-btn" 
        onClick={exportToCSV}
        disabled={!history || history.length === 0}
        title="导出为 CSV"
      >
        📊 导出 CSV
      </button>
      <button 
        className="export-btn" 
        onClick={exportToJSON}
        disabled={!history || history.length === 0}
        title="导出为 JSON"
      >
        📄 导出 JSON
      </button>
    </div>
  );
}

export default ExportButton;

