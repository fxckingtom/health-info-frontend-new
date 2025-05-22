import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const HealthyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [foodFilter, setFoodFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/healthy-recipes`
        );
        const list = response.data.data ?? response.data;
        console.log('Fetched recipes:', list);
        setRecipes(list);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleFilterChange = async (e) => {
    const food = e.target.value;
    setFoodFilter(food);
    try {
      let response;
      if (food) {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/healthy-recipes/search?q=${encodeURIComponent(
            food
          )}`
        );
      } else {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/healthy-recipes`
        );
      }
      const list = response.data.data ?? response.data;
      console.log('Filtered recipes:', list);
      setRecipes(list);
    } catch (error) {
      console.error('Error filtering recipes:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-2xl mt-10">載入中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-4xl font-bold text-primary mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        健康食譜
      </motion.h1>
      <div className="mb-4">
        <input
          type="text"
          value={foodFilter}
          onChange={handleFilterChange}
          placeholder="輸入食物名稱（如 牛肉、高麗菜）"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe._id || index}
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">
              {recipe.name}
            </h2>
            <p className="text-gray-700 mb-1">
              <strong>分類：</strong> {recipe.category}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>烹調時間：</strong> {recipe.cooking_time}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>難易度：</strong> {recipe.difficulty}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>份量：</strong> {recipe.servings} 人份
            </p>

            <p className="text-gray-700 mb-1">
              <strong>食材：</strong>
            </p>
            <ul className="list-disc list-inside mb-2">
              {Array.isArray(recipe.ingredients) ? (
                recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
              ) : (
                <li className="text-gray-400">尚未提供食材</li>
              )}
            </ul>

            <p className="text-gray-700 mb-1">
              <strong>步驟：</strong>
            </p>
            <ol className="list-decimal list-inside mb-2">
              {Array.isArray(recipe.steps) ? (
                recipe.steps.map((step, i) => <li key={i}>{step}</li>)
              ) : (
                <li className="text-gray-400">尚未提供步驟</li>
              )}
            </ol>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HealthyRecipes;
