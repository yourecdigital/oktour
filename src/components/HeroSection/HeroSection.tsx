import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Таймер обратного отсчета для создания срочности
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBookTour = () => {
    navigate('/tours');
  };

  const handleGetBonus = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему для получения бонусов');
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bonus/add', { points: 500 });
      toast.success('Получено 500 бонусных баллов!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка получения бонусов';
      toast.error(message);
    }
  };

  const handleQuickContact = () => {
    // Прокрутка к форме контактов
    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        
        {/* Уведомление о срочности */}
        <div className="urgency-banner">
          <div className="urgency-content">
            <span className="urgency-icon">⚡</span>
            <span className="urgency-text">
              <strong>ОГРАНИЧЕННОЕ ВРЕМЯ!</strong> Регистрируйтесь сейчас и получите 500 бонусов + скидку 15% на первый тур
            </span>
            <div className="countdown">
              <span className="countdown-item">
                <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="countdown-label">часов</span>
              </span>
              <span className="countdown-separator">:</span>
              <span className="countdown-item">
                <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="countdown-label">мин</span>
              </span>
              <span className="countdown-separator">:</span>
              <span className="countdown-item">
                <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="countdown-label">сек</span>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            {/* Главный заголовок с акцентом на бонусы */}
            <div className="bonus-badge">
              <span className="bonus-icon">🎁</span>
              <span className="bonus-text">500 БОНУСОВ ПРИ РЕГИСТРАЦИИ</span>
            </div>
            
            <h1 className="hero-title">
              Откройте для себя <span className="highlight">магию Сочи</span>
              <br />
              <span className="subtitle-highlight">и получите 500 бонусов сразу!</span>
            </h1>
            
            <p className="hero-subtitle">
              Лучшие туры, экскурсии и незабываемые впечатления на Черноморском побережье. 
              <strong>Регистрируйтесь сейчас и получите 500 бонусов + скидку 15% на первый тур!</strong>
            </p>
            
            {/* Социальные доказательства */}
            <div className="social-proof">
              <div className="proof-stats">
                <div className="stat-item">
                  <span className="stat-number">15,847</span>
                  <span className="stat-label">довольных клиентов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">рейтинг из 5</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">рекомендуют нас</span>
                </div>
              </div>
              
              <div className="recent-bookings">
                <div className="booking-notification">
                  <span className="user-avatar">👤</span>
                  <span className="booking-text">Мария из Москвы забронировала тур "Сочи + Красная Поляна" 2 минуты назад</span>
                </div>
                <div className="booking-notification">
                  <span className="user-avatar">👤</span>
                  <span className="booking-text">Алексей из СПб получил 500 бонусов и забронировал отель 5 минут назад</span>
                </div>
              </div>
            </div>

            {/* Усиленные призывы к действию */}
            <div className="hero-actions">
              <button className="btn btn-primary btn-large" onClick={handleGetBonus}>
                <span className="btn-icon">🎁</span>
                <span className="btn-text">
                  <span className="btn-main">Получить 500 бонусов</span>
                  <span className="btn-sub">+ скидка 15% на первый тур</span>
                </span>
              </button>
              
              <button className="btn btn-secondary btn-large" onClick={handleQuickContact}>
                <span className="btn-icon">📞</span>
                <span className="btn-text">
                  <span className="btn-main">Бесплатная консультация</span>
                  <span className="btn-sub">ответим за 30 секунд</span>
                </span>
              </button>
            </div>

            {/* Дополнительные преимущества */}
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">✅</span>
                <span>Гарантия лучшей цены</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span>Безопасная оплата</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span>Мобильное приложение</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Персональный менеджер</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="floating-card">
              <div className="card-header">
                <h3>🔥 ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</h3>
                <span className="discount">-30%</span>
              </div>
              <div className="card-content">
                <div className="tour-info">
                  <h4>Тур "Сочи + Красная Поляна"</h4>
                  <div className="tour-details">
                    <span>🏨 4* отель</span>
                    <span>🍽️ Питание включено</span>
                    <span>🚗 Трансфер</span>
                  </div>
                </div>
                <div className="price">
                  <span className="old-price">45 000 ₽</span>
                  <span className="new-price">31 500 ₽</span>
                </div>
                <div className="bonus-info">
                  <span className="bonus-label">+ 500 бонусов при бронировании</span>
                </div>
                <button className="btn btn-small btn-urgent" onClick={handleBookTour}>
                  Забронировать сейчас
                </button>
                <div className="stock-info">
                  <span className="stock-text">Осталось мест: 3</span>
                </div>
              </div>
            </div>
            
            {/* Дополнительная карточка с отзывом */}
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-avatar">👩‍💼</span>
                  <div>
                    <span className="reviewer-name">Анна Петрова</span>
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>
              <p className="review-text">
                "Получила 500 бонусов при регистрации и забронировала тур со скидкой 15%. 
                Отдых был просто потрясающий! Обязательно поеду еще раз."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
