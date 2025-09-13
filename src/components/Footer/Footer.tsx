import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <h3>СочиТур</h3>
                <p>Лучшие туры в Сочи и за рубежом</p>
              </div>
              <p className="footer-description">
                Мы предлагаем широкий выбор туров, экскурсий и услуг для незабываемого отдыха. 
                Наша команда профессионалов поможет организовать идеальное путешествие.
              </p>
              <div className="social-links">
                <a href="https://vk.com/sochitour" className="social-link" target="_blank" rel="noopener noreferrer">
                  ВК
                </a>
                <a href="https://t.me/sochitour" className="social-link" target="_blank" rel="noopener noreferrer">
                  📱
                </a>
                <a href="https://wa.me/78620000000" className="social-link" target="_blank" rel="noopener noreferrer">
                  💬
                </a>
                <a href="https://instagram.com/sochitour" className="social-link" target="_blank" rel="noopener noreferrer">
                  📷
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Направления</h4>
              <ul className="footer-links">
                <li><Link to="/hotels">Красная Поляна</Link></li>
                <li><Link to="/foreign">Зарубежные туры</Link></li>
                <li><Link to="/tours">Экскурсии</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Услуги</h4>
              <ul className="footer-links">
                <li><Link to="/tours">Туры</Link></li>
                <li><Link to="/hotels">Отели</Link></li>
                <li><Link to="/cruises">Круизы</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Контакты</h4>
              <ul className="footer-links">
                <li><a href="tel:+78622000000">+7 (862) 200-00-00</a></li>
                <li><a href="https://wa.me/78622000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href="mailto:info@sochitur.ru">info@sochitur.ru</a></li>
                <li><span className="footer-text">г. Сочи, ул. Курортная, 15</span></li>
                <li><span className="footer-text">Пн-Вс: 9:00 - 21:00</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 СочиТур. Все права защищены.</p>
            <div className="footer-bottom-links">
              <Link to="/terms">Условия использования</Link>
              <Link to="/privacy">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
