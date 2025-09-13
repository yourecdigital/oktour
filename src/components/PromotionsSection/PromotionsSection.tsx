import React from 'react';
import './PromotionsSection.css';

const PromotionsSection: React.FC = () => {
  const promotions = [
    {
      id: 1,
      title: "Сочи + Красная Поляна",
      description: "Комбинированный тур: пляжный отдых + горнолыжный курорт",
      price: 31500,
      oldPrice: 45000,
      discount: 30,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: "7 дней",
      location: "Сочи, Красная Поляна",
      rating: 4.9,
      reviews: 127,
      hot: true
    },
    {
      id: 2,
      title: "Абхазия - Новый Афон",
      description: "Экскурсионный тур с посещением пещер и монастыря",
      price: 18500,
      oldPrice: 25000,
      discount: 26,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: "5 дней",
      location: "Абхазия",
      rating: 4.8,
      reviews: 89,
      hot: false
    },
    {
      id: 3,
      title: "VIP-тур по Сочи",
      description: "Премиум отдых с индивидуальным гидом и трансфером",
      price: 75000,
      oldPrice: 95000,
      discount: 21,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: "10 дней",
      location: "Сочи",
      rating: 5.0,
      reviews: 45,
      hot: true
    }
  ];

  return (
    <section className="promotions-section">
      <div className="container">
        <div className="section-header">
          <h2>Горячие предложения</h2>
          <p>Успейте забронировать лучшие туры по выгодным ценам</p>
        </div>

        <div className="promotions-grid">
          {promotions.map((promo) => (
            <div key={promo.id} className={`promo-card ${promo.hot ? 'hot' : ''}`}>
              {promo.hot && (
                <div className="hot-badge">
                  🔥
                  <span>Горячее</span>
                </div>
              )}
              
              <div className="promo-image">
                <img src={promo.image} alt={promo.title} />
                <div className="discount-badge">-{promo.discount}%</div>
              </div>

              <div className="promo-content">
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                
                <div className="promo-details">
                  <div className="detail">
                    🕐
                    <span>{promo.duration}</span>
                  </div>
                  <div className="detail">
                    📍
                    <span>{promo.location}</span>
                  </div>
                  <div className="detail">
                    ⭐
                    <span>{promo.rating} ({promo.reviews})</span>
                  </div>
                </div>

                <div className="promo-price">
                  <span className="old-price">{promo.oldPrice.toLocaleString()} ₽</span>
                  <span className="new-price">{promo.price.toLocaleString()} ₽</span>
                </div>

                <button className="btn btn-primary">Забронировать</button>
              </div>
            </div>
          ))}
        </div>

        <div className="promotions-cta">
          <h3>Не нашли подходящий тур?</h3>
          <p>Наши менеджеры подберут для вас идеальный вариант</p>
          <button className="btn btn-secondary">Получить консультацию</button>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
