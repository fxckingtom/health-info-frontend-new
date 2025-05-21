import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import DiseaseList from './components/DiseaseList';
import HealthInfo   from './components/HealthInfo';
import HealthLog    from './components/HealthLog';
import Navbar       from './components/Navbar';
import HealthyRecipes from './HealthyRecipes';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Routes>
        <Route path="/"            element={<DiseaseList />} />
        <Route path="/health-info" element={<HealthInfo   />} />
        <Route path="/health-log"  element={<HealthLog    />} />
        <Route path="/healthy-recipes" element={<HealthyRecipes />} />
        <Route path="/hospital-map" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;



