import { useState, useEffect } from 'react';
import axios from 'axios';

function HealthLog() {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    bloodPressure: '',
    weight: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    medicationTaken: false,
    mood: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // 1) 讀取後端日誌
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get(`${API_URL}/api/health-log`);
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching health logs:', err);
      }
    }
    fetchLogs();
  }, []);

  // 表單變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/health-log`, formData);
      // 預置：最新的一筆放在最前面
      setLogs([res.data, ...logs]);
      // 重設表單
      setFormData({
        bloodPressure: '',
        weight: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        medicationTaken: false,
        mood: ''
      });
    } catch (err) {
      console.error('Error saving health log:', err);
    }
  };

  // 3) 刪除（如果你也開了 DELETE endpoint）
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/health-log/${id}`);
      setLogs(logs.filter(log => log._id !== id));
    } catch (err) {
      console.error('Error deleting health log:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center animate-fade-in">
        健康日誌
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label className="block text-secondary mb-2">血壓 (mmHg)</label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="例如：120/80"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">體重 (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">日期</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">時間</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="medicationTaken"
            checked={formData.medicationTaken}
            onChange={handleChange}
            id="medTaken"
            className="mr-2"
          />
          <label htmlFor="medTaken" className="text-secondary">今天已服用藥物</label>
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">心情日記</label>
          <textarea
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="記錄你的心情或備註"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 transition"
        >
          記錄
        </button>
      </form>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-primary mb-4">健康記錄</h2>
        {logs.length === 0 ? (
          <p className="text-secondary text-center">尚未有記錄</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="mb-2">
                  <p className="text-secondary">日期：{log.date} {log.time}</p>
                  <p className="text-secondary">血壓：{log.bloodPressure} mmHg</p>
                  <p className="text-secondary">體重：{log.weight} kg</p>
                  <p className="text-secondary">
                    藥物：{log.medicationTaken ? '已服用' : '未服用'}
                  </p>
                </div>
                <div className="mb-2 text-secondary">心情：{log.mood}</div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HealthLog;
