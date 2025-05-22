import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary text-white h-16 py-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold underline decoration-2 decoration-white">
          健康資訊網
        </Link>
        <div className="flex items-center space-x-6">
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
