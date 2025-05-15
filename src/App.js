// src/App.js
// src/App.js
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import DiseaseList from './components/DiseaseList';
import HealthInfo   from './components/HealthInfo';
import HealthLog    from './components/HealthLog';
import Navbar       from './components/Navbar';
import HealthyRecipes from './HealthyRecipes';

function App() {
  return (
    // 使用 HashRouter，不要設 basename，保證 GH-Pages 正確落到 index.html
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"               element={<DiseaseList />} />
        <Route path="/health-info"    element={<HealthInfo   />} />
        <Route path="/health-log"     element={<HealthLog    />} />
        <Route path="/healthy-recipes" element={<HealthyRecipes />} />
      </Routes>
    </Router>
  );
}

export default App;


