import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ChatBot from './Chatbot';
import announce1 from '../images/announce1.jpg';
import announce2 from '../images/announce2.jpg';


function DiseaseList() {
  // 自動輪播 index
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % announcements.length);
    }, 5000); // 每 5 秒切換一次
    return () => clearInterval(timer);
  }, []);
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [healthTip, setHealthTip] = useState('');
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 公告事項，可從後端拉取或靜態定義
  const announcements = [
    { image: announce1, text: '網站提供「健康資訊」，歡迎體驗' },
    { image: announce2, text: '網站提供「健康食譜」，歡迎體驗' },
  ];


  const healthTips = [
    '多喝水，保持水分充足。',
    '每天運動 30 分鐘，提升心肺功能。',
    '減少鹽分攝入，保護心臟健康。',
    '保持規律作息，改善睡眠品質。',
    '多吃蔬果，補充維生素和纖維。',
    '定期檢查血壓，預防高血壓。'
  ];

  useEffect(() => {
    const API_URL =
      process.env.REACT_APP_API_URL ||
      'https://health-info-backend-new.onrender.com';
    axios
      .get(`${API_URL}/api/health-info`)
      .then((response) => {
        console.log('DiseaseList API 響應:', response.data);
        const mainDiseases = response.data.filter((disease) =>
          ['糖尿病', '高血壓', '心臟病', '中風', '慢性腎病', '肥胖症'].includes(
            disease.name
          )
        );
        console.log('過濾後的疾病:', mainDiseases);
        setDiseases(mainDiseases);
        setError(null);
      })
      .catch((error) => {
        console.error('獲取疾病數據失敗:', error);
        setError('無法載入疾病數據，請稍後再試');
      });

    setHealthTip(healthTips[Math.floor(Math.random()*healthTips.length)]);
  }, []);

  const refreshTip = () => setHealthTip(healthTips[Math.floor(Math.random()*healthTips.length)]);

  const cardVariants = { hidden:{opacity:0,y:50}, visible:i=>({opacity:1,y:0,transition:{delay:i*0.2,duration:0.5,ease:'easeOut'}})};
  const modalVariants = { hidden:{opacity:0,scale:0.8}, visible:{opacity:1,scale:1,transition:{duration:0.3,ease:'easeOut'}}, exit:{opacity:0,scale:0.8,transition:{duration:0.2}}};

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 圖片滑動布告欄 */}
      <div className="relative w-full h-72 mb-8 overflow-hidden rounded-lg">
        <button onClick={()=>setCurrentIndex((currentIndex-1+announcements.length)%announcements.length)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary-dark bg-opacity-50 text-white p-1 rounded-full z-10">&lt;</button>
        <button onClick={()=>setCurrentIndex((currentIndex+1)%announcements.length)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-dark bg-opacity-50 text-white p-1 rounded-full z-10">&gt;</button>
        {announcements.map((item,idx)=>(
          <motion.div key={idx} initial={{opacity:0}} animate={{opacity:idx===currentIndex?1:0}} transition={{duration:0.5}} className="absolute inset-0">
            <img src={item.image} alt="公告" className="object-cover w-full h-full" />
            {item.text && <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-dark bg-opacity-70 px-4 py-2 rounded"><p className="text-white">{item.text}</p></div>}
          </motion.div>
        ))}
      </div>

      <h1 className="text-4xl font-bold text-primary mb-8 text-center animate-fade-in">
        探索常見疾病
      </h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : diseases.length === 0 ? (
        <p className="text-secondary text-center">無疾病數據</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease, index) => (
            <motion.div
              key={disease.name}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              onClick={() => setSelectedDisease(disease)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold text-primary mb-2">
                {disease.name}
              </h2>
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
              <h2 className="text-3xl font-bold text-primary mb-4">
                {selectedDisease.name}
              </h2>
              <p className="text-secondary mb-4">
                {selectedDisease.description}
              </p>
              <h3 className="text-xl font-semibold text-primary mb-2">
                處理建議
              </h3>
              <ul className="list-disc pl-6 text-secondary mb-6">
                {selectedDisease.handling.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedDisease(null)}
                className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition"
              >
                關閉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          今日健康小貼士
        </h2>
        <p className="text-secondary mb-4">{healthTip}</p>
        <button
          onClick={refreshTip}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          刷新
        </button>
      </div>

      <ChatBot />
    </div>
  );
}

export default DiseaseList;
