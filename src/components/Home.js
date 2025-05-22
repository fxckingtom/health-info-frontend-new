import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">歡迎使用健康資訊網站</h1>
      <p className="text-gray-600">
        點擊 <Link to="/" className="text-primary underline">這裡</Link> 查看疾病資料庫。
      </p>
    </div>
  );
}

export default Home;
