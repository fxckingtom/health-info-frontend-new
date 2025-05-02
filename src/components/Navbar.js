import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">健康資訊網</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">首頁</Link>
          <Link to="/health-info" className="hover:underline">健康資訊</Link>
          <Link to="/health-log" className="hover:underline">健康日誌</Link>
          <Link to="/healthy-recipes" className="hover:underline">健康食譜</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;