import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './ForeignPage.css';

interface ForeignTour {
  id: number;
  name: string;
  description: string;
  price: number;
  country: string;
  duration?: string;
  category?: string;
  image_url?: string;
  highlights?: string[];
  available: boolean;
}

// Популярные страны для путешествий
const POPULAR_COUNTRIES = [
  'Италия',
  'Франция',
  'Испания',
  'Германия',
  'Турция',
  'Греция',
  'Таиланд',
  'Япония',
  'США',
  'ОАЭ'
];

const ForeignPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Все');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [foreignTours, setForeignTours] = useState<ForeignTour[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchForeignTours = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/foreign-tours');
      setForeignTours(response.data.map((tour: any) => ({
        ...tour,
        highlights: tour.highlights ? JSON.parse(tour.highlights) : []
      })));
    } catch (error) {
      console.error('Error fetching foreign tours:', error);
      toast.error('Ошибка загрузки зарубежных туров');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchForeignTours, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchForeignTours();
  }, [fetchForeignTours]);

  // Получаем все страны из туров и добавляем популярные
  const allCountries = Array.from(new Set([
    ...POPULAR_COUNTRIES,
    ...foreignTours.map(tour => tour.country)
  ]));
  const countries = ['Все', ...allCountries];
  
  const categories = ['Все', ...Array.from(new Set(foreignTours.map(tour => tour.category || '').filter(Boolean)))];

  const filteredTours = foreignTours.filter(tour => {
    const countryMatch = selectedCountry === 'Все' || tour.country === selectedCountry;
    const categoryMatch = selectedCategory === 'Все' || tour.category === selectedCategory;
    return countryMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="foreign-page">
        <div className="foreign-hero">
          <h1>Загрузка зарубежных туров...</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (tour: ForeignTour) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'foreign', tour);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="foreign-page">
      <div className="foreign-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Зарубежные туры
        </motion.h1>
        <p>Откройте для себя удивительные страны и культуры мира</p>
      </div>

      <div className="foreign-container">
        <aside className="filters-sidebar">
          <h3>Страны</h3>
          
          <div className="filter-group">
            <div className="country-buttons">
              {countries.map((country) => (
                <button
                  key={country}
                  className={`country-btn ${selectedCountry === country ? 'active' : ''}`}
                  onClick={() => setSelectedCountry(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          <h3>Категории</h3>
          
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

        <main className="foreign-content">
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
                      {tour.country.charAt(0)}
                    </div>
                  )}
                  <div className="tour-price">{formatPrice(tour.price)} ₽</div>
                  <div className="tour-country">{tour.country}</div>
                </div>
                <div className="tour-content">
                  <h3>{tour.name}</h3>
                  <p className="tour-description">{tour.description}</p>
                  {tour.duration && (
                    <div className="tour-details">
                      <span className="tour-duration">⏱ {tour.duration}</span>
                    </div>
                  )}
                  {tour.category && (
                    <div className="tour-details">
                      <span className="tour-category">🏷️ {tour.category}</span>
                    </div>
                  )}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <div className="tour-highlights">
                      <h4>Основные достопримечательности:</h4>
                      <ul>
                        {tour.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
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

export default ForeignPage;

