import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DiseaseList from './components/DiseaseList';
import HealthInfo from './components/HealthInfo';
import HealthLog  from './components/HealthLog';
import HealthyRecipes from './HealthyRecipes';

/**
 * 关键：加上 basename，让所有内部跳转都以 /health-info-frontend-new 为根
 */
function App() {
  return (
    <Router basename="/health-info-frontend-new">
      <Navbar />
      <Routes>
        <Route path="/"               element={<DiseaseList   />} />
        <Route path="/health-info"    element={<HealthInfo    />} />
        <Route path="/health-log"     element={<HealthLog     />} />
        <Route path="/healthy-recipes" element={<HealthyRecipes />} />
      </Routes>
    </Router>
  );
}

export default App;




