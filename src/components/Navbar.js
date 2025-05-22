import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold leading-none">
          健康資訊網
        </Link>

        {/* 菜單項 */}
        <div className="flex items-center space-x-8">
          {[
            { to: '/', label: '首頁' },
            { to: '/health-info', label: '健康資訊' },
            { to: '/health-log', label: '健康日誌' },
            { to: '/healthy-recipes', label: '健康食譜' },
            { to: '/hospital-map', label: '附近醫院' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-base font-medium leading-none py-1 hover:text-white/80"
            >
              {item.label}
              {/* 底部高亮條：平時透明，hover 時顯示 */}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-transparent hover:bg-white transition-all"></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
