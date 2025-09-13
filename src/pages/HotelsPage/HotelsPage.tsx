import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './HotelsPage.css';

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  stars: number;
  category?: string;
  image_url?: string;
  available: boolean;
}

const HotelsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const hotelsResponse = await axios.get('http://localhost:5000/api/hotels');
      setHotels(hotelsResponse.data);
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
  const hotelCategories = ['Все', ...Array.from(new Set(hotels.map(hotel => hotel.category || '').filter(Boolean)))];

  const filteredHotels = selectedCategory === 'Все' 
    ? hotels 
    : hotels.filter(hotel => hotel.category === selectedCategory);

  if (loading) {
    return (
      <div className="hotels-page">
        <div className="hotels-hero">
          <h1>Загрузка отелей...</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (hotel: Hotel) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(hotel.id, 'hotel', hotel);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const renderStars = (stars: number) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="hotels-page">
      <div className="hotels-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Отели и гостиницы
        </motion.h1>
        <p>Найдите идеальный отель для вашего отдыха в Сочи и окрестностях</p>
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

      <div className="hotels-container">
        <aside className="filters-sidebar">
          <h3>Категории отелей</h3>
          
          <div className="filter-group">
            <div className="category-buttons">
              {hotelCategories.map((category) => (
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

        <main className="hotels-content">
          <div className="hotels-grid">
            {filteredHotels.map((hotel, index) => (
              <motion.article
                key={hotel.id}
                className="hotel-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="hotel-image">
                  {hotel.image_url ? (
                    <img 
                      src={getImageUrl(hotel.image_url)} 
                      alt={hotel.name} 
                    />
                  ) : (
                    <div className="hotel-image-placeholder">
                      {hotel.name.charAt(0)}
                    </div>
                  )}
                  <div className="hotel-price">{formatPrice(hotel.price)} ₽</div>
                </div>
                <div className="hotel-content">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-description">{hotel.description}</p>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <p className="hotel-stars">⭐ {renderStars(hotel.stars)}</p>
                  {hotel.category && (
                    <p className="hotel-category">🏷️ {hotel.category}</p>
                  )}
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToCart(hotel)}
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

export default HotelsPage;

