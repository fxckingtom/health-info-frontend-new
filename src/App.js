import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DiseaseList from './components/DiseaseList';
import HealthInfo from './components/HealthInfo';
import HealthLog  from './components/HealthLog';
import HealthyRecipes from './components/HealthyRecipes';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"             element={<DiseaseList />} />
        <Route path="/health-info"  element={<HealthInfo />} />
        <Route path="/health-log"   element={<HealthLog />} />
        <Route path="/healthy-recipes" element={<HealthyRecipes />} />
      </Routes>
    </Router>
  );
}
export default App;



