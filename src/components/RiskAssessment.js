import { useState } from 'react';
import axios from 'axios';

function RiskAssessment() {
  const [formData, setFormData] = useState({
    glucose: '',
    bmi: '',
    age: '',
    bloodPressure: '',
    familyHistory: false
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        glucose: parseFloat(formData.glucose),
        bmi: parseFloat(formData.bmi),
        age: parseInt(formData.age),
        bloodPressure: parseFloat(formData.bloodPressure),
        familyHistory: formData.familyHistory
      });
      setResult(response.data.probability);
    } catch (err) {
      setError('預測失敗，請稍後再試');
      console.error('預測錯誤:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center animate-fade-in">
        健康風險評估
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-secondary mb-2">血糖值 (mg/dL)</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">BMI</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">年齡</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-2">血壓 (mmHg)</label>
          <input
            type="number"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center text-secondary">
            <input
              type="checkbox"
              name="familyHistory"
              checked={formData.familyHistory}
              onChange={handleChange}
              className="mr-2"
            />
            是否有家族病史
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 transition"
        >
          提交評估
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
      {result && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-primary">
            風險評估結果
          </h2>
          <p className="text-secondary mt-2">
            糖尿病風險：{result}%（{parseFloat(result) < 30 ? '低風險' : parseFloat(result) < 60 ? '中風險' : '高風險'}）
          </p>
        </div>
      )}
    </div>
  );
}

export default RiskAssessment;