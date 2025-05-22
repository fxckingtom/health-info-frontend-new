import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function HealthInfo() {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'https://health-info-backend-new.onrender.com';
    axios.get(`${API_URL}/api/health-info`)
      .then((response) => {
        console.log('HealthInfo API 響應:', response.data); // 添加日誌
        setDiseases(response.data);
        setFilteredDiseases(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('獲取疾病數據失敗:', error);
        setError('無法載入疾病數據，請稍後再試');
      });
  }, []);

  useEffect(() => {
    setFilteredDiseases(
      diseases.filter((disease) =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    );
  }, [searchTerm, diseases]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center animate-fade-in">
        健康資訊查詢
      </h1>
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="輸入疾病名稱（例如：糖尿病、哮喘）"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredDiseases.length === 0 ? (
        <p className="text-secondary text-center">
          {searchTerm ? '無匹配的疾病數據' : '無疾病數據'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease, index) => (
            <motion.div
              key={disease.name}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              onClick={() => setSelectedDisease(disease)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold text-primary mb-2">{disease.name}</h2>
              <p className="text-secondary text-center">{disease.tagline}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedDisease && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg max-w-lg w-full mx-4">
              <h2 className="text-3xl font-bold text-primary mb-4">{selectedDisease.name}</h2>
              <p className="text-secondary mb-4">{selectedDisease.description}</p>
              <h3 className="text-xl font-semibold text-primary mb-2">處理建議</h3>
              <ul className="list-disc pl-6 text-secondary mb-6">
                {selectedDisease?.handling?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedDisease(null)}
                className="w-full bg-primary text-white p-2 rounded hoverbg-primary-dark transition"
              >
                關閉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HealthInfo;
