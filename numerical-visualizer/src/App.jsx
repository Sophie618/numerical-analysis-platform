import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BisectionPage from './pages/BisectionPage';
import NewtonPage from './pages/NewtonPage';
import AitkenPage from './pages/AitkenPage';
import SecantPage from './pages/SecantPage';
import AITutorPage from './pages/AITutorPage';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bisection" element={<BisectionPage />} />
            <Route path="/newton" element={<NewtonPage />} />
            <Route path="/aitken" element={<AitkenPage />} />
            <Route path="/secant" element={<SecantPage />} />
            <Route path="/ai-tutor" element={<AITutorPage />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
