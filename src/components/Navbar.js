import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold underline decoration-2 decoration-white">
          健康資訊網
        </Link>
        <div className="space-x-4">
          <Link to="/" className="underline decoration-2 decoration-primary hover:decoration-white">
            首頁
          </Link>
          <Link to="/health-info" className="underline decoration-2 decoration-primary hover:decoration-white">
            健康資訊
          </Link>
          <Link to="/health-log" className="underline decoration-2 decoration-primary hover:decoration-white">
            健康日誌
          </Link>
          <Link to="/healthy-recipes" className="underline decoration-2 decoration-primary hover:decoration-white">
            健康食譜
          </Link>
          <Link to="/hospital-map" className="underline decoration-2 decoration-primary hover:decoration-white">
            附近醫院
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
