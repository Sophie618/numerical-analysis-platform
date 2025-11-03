import { createContext, useContext, useState } from 'react';
import { PRESET_FUNCTIONS } from '../algorithms';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
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

  const [useNewtonDamping, setUseNewtonDamping] = useState(false);

  return (
    <SettingsContext.Provider 
      value={{ 
        currentFunction, 
        setCurrentFunction, 
        parameters, 
        setParameters,
        useNewtonDamping,
        setUseNewtonDamping
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

