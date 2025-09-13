import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

interface OrderItem {
  tourId: number;
  tourName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const OrdersContainer = styled.div`
  min-height: 80vh;
  padding: 40px 20px;
  background: #f8f9fa;
`;

const OrdersContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 32px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const OrderNumber = styled.h3`
  color: #333;
  font-size: 20px;
  margin: 0;
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 14px;
`;

const OrderStatus = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'completed': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const OrderTotal = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
`;

const OrderItems = styled.div`
  margin-top: 20px;
`;

const ItemCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  color: #333;
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const ItemDetails = styled.div`
  color: #666;
  font-size: 14px;
`;

const ItemPrice = styled.div`
  font-weight: bold;
  color: #667eea;
  font-size: 16px;
`;

const EmptyOrders = styled.div`
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

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 60px 20px;
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
`;

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (!user) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <LoginPrompt>
            <h3>Войдите в систему</h3>
            <p>Для просмотра заказов необходимо войти в систему</p>
            <Button onClick={() => navigate('/login')}>
              Войти
            </Button>
          </LoginPrompt>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  if (loading) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <LoadingSpinner>Загрузка заказов...</LoadingSpinner>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <EmptyOrders>
            <h3>У вас пока нет заказов</h3>
            <p>Сделайте первый заказ, чтобы увидеть его здесь</p>
            <Button onClick={() => navigate('/tours')}>
              Перейти к турам
            </Button>
          </EmptyOrders>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersContent>
        <Title>Мои заказы</Title>
        
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderInfo>
                <OrderNumber>Заказ #{order.id}</OrderNumber>
                <OrderDate>{formatDate(order.createdAt)}</OrderDate>
              </OrderInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <OrderStatus status={order.status}>
                  {order.status === 'pending' && 'Ожидает подтверждения'}
                  {order.status === 'confirmed' && 'Подтвержден'}
                  {order.status === 'completed' && 'Завершен'}
                  {order.status === 'cancelled' && 'Отменен'}
                </OrderStatus>
                <OrderTotal>{formatPrice(order.totalAmount)} ₽</OrderTotal>
              </div>
            </OrderHeader>
            
            <OrderItems>
              {order.items.map((item, index) => (
                <ItemCard key={index}>
                  <ItemInfo>
                    <ItemName>{item.tourName}</ItemName>
                    <ItemDetails>
                      Количество: {item.quantity} | Цена за единицу: {formatPrice(item.price)} ₽
                    </ItemDetails>
                  </ItemInfo>
                  <ItemPrice>
                    {formatPrice(item.price * item.quantity)} ₽
                  </ItemPrice>
                </ItemCard>
              ))}
            </OrderItems>
          </OrderCard>
        ))}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;






