import Chatbot from './Chatbot';

function SymptomChecker() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">症狀檢測</h1>
      <Chatbot />
    </div>
  );
}

export default SymptomChecker;