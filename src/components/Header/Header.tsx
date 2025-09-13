import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <h1>СочиТур</h1>
            <span>Лучшие туры в Сочи</span>
          </Link>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>Главная</Link></li>
            <li><Link to="/tours" className={isActive('/tours') ? 'active' : ''} onClick={closeMenu}>Туры</Link></li>
            <li><Link to="/hotels" className={isActive('/hotels') ? 'active' : ''} onClick={closeMenu}>Отели</Link></li>
            <li><Link to="/foreign" className={isActive('/foreign') ? 'active' : ''} onClick={closeMenu}>Зарубеж</Link></li>
            <li><Link to="/cruises" className={isActive('/cruises') ? 'active' : ''} onClick={closeMenu}>Круизы</Link></li>
            <li><Link to="/services" className={isActive('/services') ? 'active' : ''} onClick={closeMenu}>Услуги</Link></li>
            <li><Link to="/promotions" className={isActive('/promotions') ? 'active' : ''} onClick={closeMenu}>Акции</Link></li>
            <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={closeMenu}>Контакты</Link></li>
          </ul>
          
          {/* Мобильные кнопки аутентификации */}
          <div className="mobile-auth-actions">
            {user ? (
              <>
                <Link to="/cart" className="cart-button" onClick={closeMenu}>
                  🛒 Корзина
                  {getCartCount() > 0 && (
                    <span className="cart-count">{getCartCount()}</span>
                  )}
                </Link>
                <Link to="/profile" className="profile-button" onClick={closeMenu}>
                  👤 {user.name}
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button login" onClick={closeMenu}>
                  Войти
                </Link>
                <Link to="/register" className="auth-button register" onClick={closeMenu}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Десктопные кнопки аутентификации */}
        <div className="header-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-button" onClick={closeMenu}>
                🛒 Корзина
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </Link>
              <Link to="/profile" className="profile-button" onClick={closeMenu}>
                👤 {user.name}
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button login" onClick={closeMenu}>
                Войти
              </Link>
              <Link to="/register" className="auth-button register" onClick={closeMenu}>
                Регистрация
              </Link>
            </>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Header;
