import React from 'react';
import './TopDestinationsSection.css';

const TopDestinationsSection: React.FC = () => {
  const destinations = [
    {
      id: 1,
      name: "Сочи",
      description: "Столица летних Олимпийских игр 2014 года",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.9,
      reviews: 1250,
      tours: 45,
      price: "от 15 000 ₽",
      features: ["Пляжи", "Олимпийский парк", "Курортный проспект"]
    },
    {
      id: 2,
      name: "Красная Поляна",
      description: "Горнолыжный курорт мирового уровня",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.8,
      reviews: 890,
      tours: 32,
      price: "от 25 000 ₽",
      features: ["Горные лыжи", "Канатные дороги", "Экстремальный спорт"]
    },
    {
      id: 3,
      name: "Абхазия",
      description: "Загадочная страна с древней историей",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.7,
      reviews: 756,
      tours: 28,
      price: "от 12 000 ₽",
      features: ["Новый Афон", "Пицунда", "Гагры"]
    },
    {
      id: 4,
      name: "Зарубежные туры",
      description: "Путешествия по всему миру",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.9,
      reviews: 2100,
      tours: 120,
      price: "от 50 000 ₽",
      features: ["Европа", "Азия", "Америка"]
    }
  ];

  return (
    <section className="destinations-section">
      <div className="container">
        <div className="section-header">
          <h2>Популярные направления</h2>
          <p>Выберите идеальное место для вашего отдыха</p>
        </div>

        <div className="destinations-grid">
          {destinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <div className="destination-image">
                <img src={destination.image} alt={destination.name} />
                <div className="destination-overlay">
                  <button className="btn btn-primary">Подробнее</button>
                </div>
              </div>

              <div className="destination-content">
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                
                <div className="destination-stats">
                  <div className="stat">
                    ⭐
                    <span>{destination.rating} ({destination.reviews})</span>
                  </div>
                  <div className="stat">
                    👥
                    <span>{destination.tours} туров</span>
                  </div>
                </div>

                <div className="destination-features">
                  {destination.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>

                <div className="destination-footer">
                  <span className="price">{destination.price}</span>
                  <button className="btn btn-secondary">Выбрать тур</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="destinations-cta">
          <div className="cta-content">
            <h3>Хотите узнать больше о направлениях?</h3>
            <p>Наши эксперты расскажут о каждом курорте и помогут выбрать лучший вариант</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Получить консультацию</button>
              <button className="btn btn-outline">Скачать каталог</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopDestinationsSection;
