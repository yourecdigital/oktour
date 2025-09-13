import React, { useState } from 'react';
import './ContactFormSection.css';

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    dates: '',
    guests: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Сброс формы через 3 секунды
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        destination: '',
        dates: '',
        guests: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <section className="contact-form-section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-header">
              <h2>Получите персональное предложение</h2>
              <p>Оставьте заявку, и наш менеджер свяжется с вами в течение 15 минут</p>
            </div>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  📞
                </div>
                <div className="info-content">
                  <h4>Телефон</h4>
                  <p>+7 (862) 200-00-00</p>
                  <a href="tel:+78620000000" className="info-link">Позвонить</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  💬
                </div>
                <div className="info-content">
                  <h4>WhatsApp</h4>
                  <p>+7 (862) 200-00-00</p>
                  <a href="https://wa.me/78620000000" className="info-link" target="_blank" rel="noopener noreferrer">Написать</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  ✉️
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>info@sochitur.ru</p>
                  <a href="mailto:info@sochitur.ru" className="info-link">Написать</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  📍
                </div>
                <div className="info-content">
                  <h4>Адрес</h4>
                  <p>г. Сочи, ул. Курортная, 15</p>
                  <a href="#map" className="info-link">Посмотреть на карте</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  🕐
                </div>
                <div className="info-content">
                  <h4>Режим работы</h4>
                  <p>Пн-Вс: 9:00 - 21:00</p>
                  <span className="info-note">Без выходных</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Спасибо за заявку!</h3>
                <p>Наш менеджер свяжется с вами в течение 15 минут</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-header">
                  <h3>Оставить заявку</h3>
                  <p>Заполните форму, и мы подберем идеальный тур</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Имя *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="destination">Направление</label>
                    <select
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                    >
                      <option value="">Выберите направление</option>
                      <option value="sochi">Сочи</option>
                      <option value="krasnaya-polyana">Красная Поляна</option>
                      <option value="abkhazia">Абхазия</option>
                      <option value="foreign">Зарубежные туры</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dates">Даты поездки</label>
                    <input
                      type="text"
                      id="dates"
                      name="dates"
                      value={formData.dates}
                      onChange={handleChange}
                      placeholder="Когда планируете поехать?"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guests">Количество гостей</label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                    >
                      <option value="">Выберите количество</option>
                      <option value="1">1 человек</option>
                      <option value="2">2 человека</option>
                      <option value="3">3 человека</option>
                      <option value="4">4 человека</option>
                      <option value="5+">5+ человек</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Дополнительная информация</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Расскажите о ваших пожеланиях..."
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправляем...' : 'Получить предложение'}
                </button>

                <p className="form-note">
                  Нажимая кнопку, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
