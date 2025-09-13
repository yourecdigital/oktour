import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './ServicesPage.css';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchServices, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = ['Все', ...Array.from(new Set(services.map(service => service.category || '').filter(Boolean)))];

  const filteredServices = selectedCategory === 'Все' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="services-page">
        <div className="services-hero">
          <h1>Загрузка услуг...</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (service: Service) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(service.id, 'tour', service);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="services-page">
      <div className="services-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Наши услуги
        </motion.h1>
        <p>Выберите дополнительные услуги для комфортного отдыха</p>
      </div>

      <div className="services-container">
        <aside className="filters-sidebar">
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

        <main className="services-content">
          <div className="services-grid">
            {filteredServices.map((service, index) => (
              <motion.article
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="service-image">
                                  {service.image_url ? (
                  <img 
                    src={getImageUrl(service.image_url)} 
                    alt={service.name} 
                  />
                ) : (
                    <div className="service-icon">
                      {service.category === 'Транспортные услуги' ? '🚗' : 
                       service.category === 'Экскурсионные услуги' ? '🎯' : 
                       service.category === 'Ресторанные услуги' ? '🍽️' : '🛠️'}
                    </div>
                  )}
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-category">📋 {service.category}</div>
                  <div className="service-price">{formatPrice(service.price)} ₽</div>
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToCart(service)}
                  >
                    Заказать услугу
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

export default ServicesPage;

