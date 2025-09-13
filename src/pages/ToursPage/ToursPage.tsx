import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './ToursPage.css';

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
  destination?: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const ToursPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const toursResponse = await axios.get('http://localhost:5000/api/tours');
      setTours(toursResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  const { refresh } = useAutoRefresh(fetchData, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Получаем уникальные категории из данных
  const tourCategories = ['Все', ...Array.from(new Set(tours.map(tour => tour.category || '').filter(Boolean)))];

  const filteredTours = selectedCategory === 'Все' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  if (loading) {
    return (
      <div className="tours-page">
        <div className="tours-hero">
          <h1>Загрузка туров...</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (tour: Tour) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'tour', tour);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="tours-page">
      <div className="tours-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Туры по Сочи
        </motion.h1>
        <p>Найдите идеальный тур для вашего отдыха в Сочи и окрестностях</p>
        <motion.button
          className="refresh-btn"
          onClick={() => {
            refresh();
            toast.success('Данные обновлены');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '10px'
          }}
        >
          🔄 Обновить данные
        </motion.button>
      </div>

      <div className="tours-container">
        <aside className="filters-sidebar">
          <h3>Категории туров</h3>
          
          <div className="filter-group">
            <div className="category-buttons">
              {tourCategories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="tours-content">
          <div className="tours-grid">
            {filteredTours.map((tour, index) => (
              <motion.article
                key={tour.id}
                className="tour-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="tour-image">
                  {tour.image_url ? (
                    <img 
                      src={getImageUrl(tour.image_url)} 
                      alt={tour.name} 
                    />
                  ) : (
                    <div className="tour-image-placeholder">
                      {tour.name.charAt(0)}
                    </div>
                  )}
                  <div className="tour-price">{formatPrice(tour.price)} ₽</div>
                </div>
                <div className="tour-content">
                  <h3>{tour.name}</h3>
                  <p className="tour-description">{tour.description}</p>
                  {tour.duration && (
                    <p className="tour-duration">⏱ {tour.duration}</p>
                  )}
                  {tour.destination && (
                    <p className="tour-destination">📍 {tour.destination}</p>
                  )}
                  {tour.category && (
                    <p className="tour-category">🏷️ {tour.category}</p>
                  )}
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToCart(tour)}
                  >
                    Добавить в корзину
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ToursPage;
