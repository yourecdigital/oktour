import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './CruisesPage.css';

interface Cruise {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
  departure: string;
  destination?: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const CruisesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCruises = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cruises');
      setCruises(response.data);
    } catch (error) {
      console.error('Error fetching cruises:', error);
      toast.error('Ошибка загрузки круизов');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  const { refresh } = useAutoRefresh(fetchCruises, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchCruises();
  }, [fetchCruises]);

  if (loading) {
    return (
      <div className="cruises-page">
        <div className="cruises-hero">
          <h1>Загрузка круизов...</h1>
        </div>
      </div>
    );
  }



  const handleAddToCart = async (cruise: Cruise) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(cruise.id, 'cruise', cruise);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const categories = ['Все', ...Array.from(new Set(cruises.map(cruise => cruise.category || '').filter(Boolean)))];

  const filteredCruises = selectedCategory === 'Все' 
    ? cruises 
    : cruises.filter(cruise => cruise.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="cruises-page">
      <div className="cruises-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Astoria Grande
        </motion.h1>
        <p>Первый круизный лайнер с выходом из порта Сочи</p>
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

      <div className="cruises-container">
        <aside className="filters-sidebar">
          <h3>Направления</h3>
          
          <div className="filter-group">
            <div className="category-buttons">
              {categories.map((category) => (
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

        <main className="cruises-content">
          <div className="cruise-info-section">
          <motion.div 
            className="cruise-description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>О лайнере</h2>
            <p>
              Astoria Grande – первый круизный лайнер, который осуществляет зарубежные морские круизы 
              с выходом из российского порта Сочи по Черному морю. Проект создан настоящими экспертами 
              круизного бизнеса с многолетним успешным опытом работы в индустрии, как в России, так и за рубежом.
            </p>
          </motion.div>

          <motion.div 
            className="cruise-features"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3>Возможности лайнера</h3>
            <ul>
              <li>Два ресторана с питанием по системе шведского стола</li>
              <li>Ресторан а-ля карт</li>
              <li>Body&Soul SPA с финской парной</li>
              <li>Восточный хамам</li>
              <li>Бассейн и джакузи</li>
              <li>Волейбольная и баскетбольная площадки</li>
              <li>Взрослая и детская развлекательная программа</li>
              <li>WHITE party на круизном лайнере</li>
            </ul>
          </motion.div>
        </div>

        <div className="cruises-grid">
          {filteredCruises.map((cruise, index) => (
            <motion.article
              key={cruise.id}
              className="cruise-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="cruise-image">
                {cruise.image_url ? (
                  <img 
                    src={getImageUrl(cruise.image_url)} 
                    alt={cruise.name} 
                  />
                ) : (
                  <div className="cruise-image-placeholder">
                    🚢
                  </div>
                )}
                <div className="cruise-price">{formatPrice(cruise.price)} ₽</div>
                <div className="cruise-duration">{cruise.duration}</div>
              </div>
              <div className="cruise-content">
                <h3>{cruise.name}</h3>
                <p className="cruise-description">{cruise.description}</p>
                <div className="cruise-details">
                  <span className="cruise-departure">🚢 Отправление: {cruise.departure}</span>
                  {cruise.destination && (
                    <span className="cruise-destination">📍 Направление: {cruise.destination}</span>
                  )}
                  {cruise.category && (
                    <span className="cruise-category">🏷️ {cruise.category}</span>
                  )}
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => handleAddToCart(cruise)}
                >
                  Забронировать круиз
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          className="cruise-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2>Нужна консультация?</h2>
          <p>Наши эксперты помогут подобрать идеальный круиз для вас</p>
          <button className="btn-secondary" onClick={() => navigate('/contact')}>
            Получить консультацию
          </button>
        </motion.div>
      </main>
      </div>
    </div>
  );
};

export default CruisesPage;


