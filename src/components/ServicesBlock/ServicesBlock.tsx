import React from 'react';
import './ServicesBlock.css';

const ServicesBlock: React.FC = () => {
  return (
    <section className="services-block">
      <div className="container">
        <h2>Наши услуги</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Туры по Сочи</h3>
            <p>Увлекательные экскурсии по самым красивым местам города</p>
          </div>
          <div className="service-card">
            <h3>Забронирование отелей</h3>
            <p>Комфортное размещение в лучших отелях курорта</p>
          </div>
          <div className="service-card">
            <h3>Трансферы</h3>
            <p>Удобная доставка из аэропорта и между объектами</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesBlock;
