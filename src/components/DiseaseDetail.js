import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DiseaseDetail() {
  const { icdCode } = useParams();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios
      .get(`${API_URL}/api/diseases/${icdCode}`)
      .then((response) => {
        console.log('DiseaseDetail API 響應:', response.data); // 添加日誌
        setDisease(response.data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error('獲取疾病詳情失敗:', error);
        setError(`無法載入疾病資訊：${error.message}`);
        setLoading(false);
      });
  }, [icdCode]);

  if (loading) {
    return <div className="container mx-auto p-6">載入中...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-600">{error}</p>
        <Link to="/diseases" className="text-blue-600 hover:underline">
          返回疾病列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Link to="/diseases" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; 返回疾病列表
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{disease.name}</h1>
        <p className="text-gray-700 mb-4">{disease.description}</p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">症狀</h2>
          <ul className="list-disc pl-6">
            {disease.symptoms.length > 0 ? (
              disease.symptoms.map((symptom, index) => (
                <li key={index} className="text-gray-600">{symptom}</li>
              ))
            ) : (
              <li className="text-gray-600">無症狀資訊</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">治療</h2>
          <ul className="list-disc pl-6">
            {disease.treatments.length > 0 ? (
              disease.treatments.map((treatment, index) => (
                <li key={index} className="text-gray-600">{treatment}</li>
              ))
            ) : (
              <li className="text-gray-600">無治療資訊</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetail;