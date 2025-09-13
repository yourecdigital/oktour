import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const handleQuickContact = () => {
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = (type: string) => {
    navigate(`/${type}`);
  };

  const handleAddToCart = async (item: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(item.id, 'room', item);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionsRes, hotelsRes, servicesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/promotions'),
          axios.get('http://localhost:5000/api/hotels'),
          axios.get('http://localhost:5000/api/services')
        ]);
        
        setPromotions(promotionsRes.data);
        setHotels(hotelsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Главная секция */}
      <section className="hero-section">
        <div className="hero-background">
          <video 
            className="hero-video" 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            poster="/videos/hero-background-fallback.jpg"
            onError={(e) => {
              console.error('Video loading error:', e);
              const videoElement = e.target as HTMLVideoElement;
              videoElement.style.display = 'none';
            }}
          >
            {/* HD версия для десктопа */}
            <source 
              src="/videos/hero-background.mp4" 
              type="video/mp4" 
              media="(min-width: 768px)"
            />
            {/* SD версия для мобильных */}
            <source 
              src="/videos/hero-background-mobile.mp4" 
              type="video/mp4" 
              media="(max-width: 767px)"
            />
            {/* Fallback для браузеров без поддержки видео */}
            <img src="/videos/hero-background-fallback.jpg" alt="Sochi background" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-left">
              {/* Главный заголовок */}
              <h1 className="hero-title">
                Откройте для себя <span className="highlight">магию Сочи</span>
              </h1>

              {/* Подзаголовок */}
              <p className="hero-subtitle">
                Лучшие туры, экскурсии и незабываемые впечатления на Черноморском побережье. 
                Регистрируйтесь сейчас и получите 500 бонусов + скидку 15% на первый тур.
              </p>

              {/* Кнопки */}
              <div className="hero-actions">
                <div className="hero-actions-row">
                  <button className="btn btn-primary btn-large" onClick={() => handleBookNow('tours')}>
                    <span className="btn-icon">🏔️</span>
                    <div className="btn-text">
                      <span className="btn-main">Смотреть туры</span>
                      <span className="btn-sub">От 1 800 ₽</span>
                    </div>
                  </button>

                  <button className="btn btn-primary btn-large" onClick={() => handleBookNow('hotels')}>
                    <span className="btn-icon">🏨</span>
                    <div className="btn-text">
                      <span className="btn-main">Забронировать отель</span>
                      <span className="btn-sub">От 12 000 ₽</span>
                    </div>
                  </button>
                </div>

                <div className="hero-actions-row">
                  <button className="btn btn-primary" onClick={handleQuickContact}>
                    <span className="btn-icon">📞</span>
                    <span>Быстрая консультация</span>
                  </button>

                  <button className="btn btn-primary" onClick={() => navigate('/register')}>
                    <span className="btn-icon">🎁</span>
                    <span>500 бонусов при регистрации</span>
                  </button>
                </div>
              </div>

              {/* Преимущества */}
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
                  <span className="feature-icon">🎯</span>
                  <span>Индивидуальный подход</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⭐</span>
                  <span>4.9/5 рейтинг клиентов</span>
                </div>
              </div>
            </div>

            {/* Правая часть героя */}
            <div className="hero-right">
              {/* Карточка горячего предложения */}
              {promotions.length > 0 ? (
                <div className="hot-offer-card">
                  <div className="card-header">
                    <h3>🔥 ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</h3>
                    <span className="discount">-{promotions[0].discount_percent}%</span>
                  </div>
                  <div className="tour-info">
                    <h4>{promotions[0].title}</h4>
                    <div className="tour-details">
                      <span>{promotions[0].description}</span>
                    </div>
                  </div>
                  <div className="bonus-info">
                    <span className="bonus-label">+ 500 бонусов при бронировании</span>
                  </div>
                  <button className="btn btn-small btn-urgent" onClick={() => handleBookNow('promotions')}>
                    Подробнее
                  </button>
                </div>
              ) : hotels.length > 0 ? (
                <div className="hot-offer-card">
                  <div className="card-header">
                    <h3>🔥 ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</h3>
                    <span className="discount">-20%</span>
                  </div>
                  <div className="tour-info">
                    <h4>{hotels[0].name}</h4>
                    <div className="tour-details">
                      <span>🏨 {hotels[0].stars}* отель</span>
                      <span>📍 {hotels[0].location}</span>
                      <span>🛏️ Номер делюкс</span>
                    </div>
                  </div>
                  <div className="price">
                    <span className="old-price">{Math.round(hotels[0].price * 1.25).toLocaleString()} ₽</span>
                    <span className="new-price">{hotels[0].price.toLocaleString()} ₽</span>
                  </div>
                  <div className="bonus-info">
                    <span className="bonus-label">+ 500 бонусов при бронировании</span>
                  </div>
                  <button className="btn btn-small btn-urgent" onClick={() => handleAddToCart({
                    id: hotels[0].id,
                    name: hotels[0].name,
                    description: hotels[0].description,
                    price: hotels[0].price,
                    location: hotels[0].location,
                    stars: hotels[0].stars
                  })}>
                    Забронировать сейчас
                  </button>
                  <div className="stock-info">
                    <span className="stock-text">Осталось номеров: 3</span>
                  </div>
                </div>
              ) : (
                <div className="hot-offer-card">
                  <div className="card-header">
                    <h3>🔥 ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</h3>
                    <span className="discount">-20%</span>
                  </div>
                  <div className="tour-info">
                    <h4>Сочи Марриотт Красная Поляна</h4>
                    <div className="tour-details">
                      <span>🏨 5* отель</span>
                      <span>🏔️ Вид на горы</span>
                      <span>🛏️ Номер делюкс</span>
                    </div>
                  </div>
                  <div className="price">
                    <span className="old-price">18 000 ₽</span>
                    <span className="new-price">14 400 ₽</span>
                  </div>
                  <div className="bonus-info">
                    <span className="bonus-label">+ 500 бонусов при бронировании</span>
                  </div>
                  <button className="btn btn-small btn-urgent" onClick={() => handleAddToCart({
                    id: 4,
                    name: "Номер делюкс с видом на горы с 2-мя раздельными кроватями",
                    description: "Номер с панорамным видом на горы и двумя раздельными кровами",
                    price: 14400,
                    capacity: "2 гостя",
                    features: ["Панорамный вид", "2 раздельные кровати", "Большой балкон", "Мини-бар", "Wi-Fi"]
                  })}>
                    Забронировать сейчас
                  </button>
                  <div className="stock-info">
                    <span className="stock-text">Осталось номеров: 2</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Секция услуг */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Наши услуги</h2>
            <p>Выберите идеальный вариант для вашего отдыха</p>
          </div>
          
          <div className="services-grid">
            {services.slice(0, 4).map((service: any) => (
              <div key={service.id} className="service-card" onClick={() => handleBookNow('services')}>
                <div className="service-icon">🛠️</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-price">{service.price} ₽</div>
                <div className="service-bonus">+ 500 бонусов</div>
              </div>
            ))}
            
            {services.length === 0 && (
              <>
                <div className="service-card" onClick={() => handleBookNow('tours')}>
                  <div className="service-icon">🏔️</div>
                  <h3>Туры по Сочи</h3>
                  <p>Экскурсии по Красной Поляне, морские прогулки, посещение Олимпийского парка и многое другое</p>
                  <div className="service-bonus">+ 500 бонусов</div>
                </div>
                
                <div className="service-card" onClick={() => handleBookNow('hotels')}>
                  <div className="service-icon">🏨</div>
                  <h3>Отели и гостиницы</h3>
                  <p>Премиальные отели в центре Сочи и Красной Поляне с лучшими видами и сервисом</p>
                  <div className="service-bonus">+ 500 бонусов</div>
                </div>
                
                <div className="service-card" onClick={() => handleBookNow('foreign')}>
                  <div className="service-icon">✈️</div>
                  <h3>Зарубежные туры</h3>
                  <p>Путешествия по всему миру с профессиональными гидами и лучшими маршрутами</p>
                  <div className="service-bonus">+ 500 бонусов</div>
                </div>
                
                <div className="service-card" onClick={() => handleBookNow('cruises')}>
                  <div className="service-icon">🚢</div>
                  <h3>Круизы</h3>
                  <p>Морские круизы по самым красивым маршрутам с комфортными лайнерами</p>
                  <div className="service-bonus">+ 500 бонусов</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Почему выбирают нас</h2>
            <p>Мы делаем ваш отдых незабываемым</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <h3>Индивидуальный подход</h3>
              <p>Каждый клиент получает персональное внимание и рекомендации от наших экспертов</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3>Лучшие цены</h3>
              <p>Гарантируем самые выгодные тарифы и специальные предложения для наших клиентов</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">🛡️</div>
              <h3>Безопасность</h3>
              <p>Все туры застрахованы, а платежи защищены современными технологиями</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">📞</div>
              <h3>Поддержка 24/7</h3>
              <p>Наша команда поддержки всегда готова помочь вам в любое время</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция готовности к путешествию */}
      <section className="journey-section">
        <div className="container">
          <div className="journey-content">
            <div className="journey-header">
              <h2>Готовы к незабываемому путешествию?</h2>
              <p>Свяжитесь с нами для получения персональной консультации и лучших предложений</p>
            </div>
            
            <div className="journey-grid">
              <div className="journey-info">
                <div className="contact-info">
                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div>
                      <h4>Телефон</h4>
                      <p>+7 (862) 123-45-67</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">✉️</div>
                    <div>
                      <h4>Email</h4>
                      <p>info@sochi-travel.ru</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div>
                      <h4>Адрес</h4>
                      <p>г. Сочи, ул. Курортная, 123</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">🕒</div>
                    <div>
                      <h4>Время работы</h4>
                      <p>Пн-Вс: 9:00 - 21:00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="journey-form">
                <h3>Оставить заявку</h3>
                <form>
                  <input type="text" placeholder="Ваше имя" required />
                  <input type="tel" placeholder="Телефон" required />
                  <input type="email" placeholder="Email" required />
                  <textarea placeholder="Сообщение" rows={4}></textarea>
                  <button type="submit" className="btn btn-primary">Отправить заявку</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
