import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import styled from 'styled-components';

const CartContainer = styled.div`
  min-height: 80vh;
  padding: 40px 20px;
  background: #f8f9fa;
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 32px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  h3 {
    color: #666;
    margin-bottom: 20px;
  }

  p {
    color: #999;
    margin-bottom: 30px;
  }
`;

const CartItem = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;

  h3 {
    color: #333;
    margin-bottom: 8px;
    font-size: 18px;
  }

  p {
    color: #666;
    margin-bottom: 5px;
    font-size: 14px;
  }
`;

const ItemPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;



const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;

  &.total {
    font-size: 20px;
    font-weight: bold;
    color: #667eea;
    border-top: 2px solid #eee;
    padding-top: 15px;
    margin-top: 15px;
  }
`;

const CheckoutButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 20px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 15px;
`;

const RegisterButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, getCartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setIsCheckingOut(true);
    try {
      await axios.post('http://localhost:5000/api/orders');
      toast.success('Заказ успешно создан!');
      navigate('/orders');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка создания заказа';
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <CartContainer>
        <CartContent>
          <LoginPrompt>
            <h3>Войдите в систему</h3>
            <p>Для просмотра корзины необходимо войти в систему</p>
            <LoginButton onClick={() => navigate('/login')}>
              Войти
            </LoginButton>
            <RegisterButton onClick={() => navigate('/register')}>
              Зарегистрироваться
            </RegisterButton>
          </LoginPrompt>
        </CartContent>
      </CartContainer>
    );
  }

  if (loading) {
    return (
      <CartContainer>
        <CartContent>
          <Title>Загрузка корзины...</Title>
        </CartContent>
      </CartContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <CartContent>
          <EmptyCart>
            <h3>Корзина пуста</h3>
            <p>Добавьте туры или номера отелей в корзину для оформления заказа</p>
            <LoginButton onClick={() => navigate('/tours')}>
              Перейти к турам
            </LoginButton>
          </EmptyCart>
        </CartContent>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartContent>
        <Title>Корзина</Title>
        
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <ItemImage>
              {item.name.charAt(0)}
            </ItemImage>
            <ItemInfo>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.type === 'tour' && (
                <>
                  <p>Длительность: {item.duration}</p>
                  <p>Направление: {item.destination}</p>
                </>
              )}
              {item.type === 'room' && (
                <>
                  <p>Вместимость: {item.capacity}</p>
                  {item.features && item.features.length > 0 && (
                    <p>Особенности: {item.features.slice(0, 3).join(', ')}</p>
                  )}
                </>
              )}
              {item.type === 'foreign' && (
                <>
                  <p>Страна: {item.country}</p>
                  <p>Длительность: {item.duration}</p>
                  <p>Направление: {item.destination}</p>
                  {item.highlights && item.highlights.length > 0 && (
                    <p>Достопримечательности: {item.highlights.slice(0, 2).join(', ')}</p>
                  )}
                </>
              )}
              {item.type === 'cruise' && (
                <>
                  <p>Тип: Круиз</p>
                  <p>Длительность: {item.duration}</p>
                  <p>Отправление: {item.departure}</p>
                  {item.highlights && item.highlights.length > 0 && (
                    <p>Маршрут: {item.highlights.slice(0, 2).join(', ')}</p>
                  )}
                </>
              )}
              <ItemPrice>{new Intl.NumberFormat('ru-RU').format(item.price)} ₽</ItemPrice>
              <QuantityControl>
                <span>Количество: {item.quantity}</span>
              </QuantityControl>
            </ItemInfo>
            <RemoveButton onClick={() => removeFromCart(item.id)}>
              Удалить
            </RemoveButton>
          </CartItem>
        ))}

        <CartSummary>
          <SummaryRow>
            <span>Товаров в корзине:</span>
            <span>{cartItems.length}</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Итого:</span>
            <span>{getCartTotal()} ₽</span>
          </SummaryRow>
          <CheckoutButton 
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Оформление заказа...' : 'Оформить заказ'}
          </CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;




