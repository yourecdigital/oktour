import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData);
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Свяжитесь с нами</h1>
          <p>Мы готовы ответить на все ваши вопросы и помочь организовать незабываемое путешествие в Сочи</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Контактная информация</h2>
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    📞
                  </div>
                  <div className="info-content">
                    <h3>Телефон</h3>
                    <p>+7 (862) 200-00-00</p>
                    <p>+7 (862) 200-00-01</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    ✉️
                  </div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p>info@sochitour.ru</p>
                    <p>booking@sochitour.ru</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    📍
                  </div>
                  <div className="info-content">
                    <h3>Адрес</h3>
                    <p>г. Сочи, ул. Курортный проспект, 123</p>
                    <p>Офис 45, 4 этаж</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    🕐
                  </div>
                  <div className="info-content">
                    <h3>Режим работы</h3>
                    <p>Пн-Пт: 9:00 - 20:00</p>
                    <p>Сб-Вс: 10:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h3>Мы в социальных сетях</h3>
                <div className="social-icons">
                  <a href="https://wa.me/78620000000" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                    💬
                  </a>
                  <a href="https://t.me/sochitour" target="_blank" rel="noopener noreferrer" className="social-icon telegram">
                    📱
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>Отправить сообщение</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите ваш email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Введите ваш телефон"
                  />
                </div>



                <div className="form-group">
                  <label htmlFor="message">Сообщение *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Опишите ваши пожелания или задайте вопрос"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit">
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>

          <div className="map-section">
            <h2>Как нас найти</h2>
            <div className="map-placeholder">
              <div className="map-content">
                📍
                <p>Карта будет загружена здесь</p>
                <p>г. Сочи, ул. Курортный проспект, 123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
