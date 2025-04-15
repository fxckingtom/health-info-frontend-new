import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiseaseList from './components/DiseaseList';
import HealthInfo from './components/HealthInfo';
import RiskAssessment from './components/RiskAssessment';
import HealthLog from './components/HealthLog';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DiseaseList />} />
        <Route path="/health-info" element={<HealthInfo />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/health-log" element={<HealthLog />} />
      </Routes>
    </Router>
  );
}

export default App;