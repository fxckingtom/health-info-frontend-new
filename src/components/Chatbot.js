import { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: '你好！我可以幫你解答醫療問題或介紹網站功能！', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://health-info-backend-new.onrender.com';
  console.log('Chatbot API URL:', API_URL); // 添加日誌

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const botResponse = await axios.post(`${API_URL}/api/chat`, { message: input });
      setMessages(prev => [...prev, { text: botResponse.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('聊天請求失敗:', error.message);
      const errorMessage = error.response 
        ? `伺服器錯誤: ${error.response.status} - ${error.response.data.error || '未知錯誤'}`
        : error.message === 'Network Error' 
          ? '無法連接到伺服器，請檢查網絡或後端服務'
          : '抱歉，出了點問題，請稍後再試';
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">
            <span>健康助理</span>
            <button onClick={() => setIsOpen(false)} className="text-white">X</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              className="w-full p-2 border rounded-lg"
              placeholder="輸入問題..."
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          對話
        </button>
      )}
    </div>
  );
}

export default Chatbot;
