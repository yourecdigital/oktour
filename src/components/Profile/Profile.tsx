import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: 80vh;
  padding: 40px 20px;
  background: #f8f9fa;
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 32px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ProfileSection = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #555;
`;

const Value = styled.span`
  color: #333;
  font-size: 16px;
`;

const BonusPoints = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 30px;
`;

const BonusTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 18px;
`;

const BonusAmount = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
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

  &.secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
    }
  }

  &.danger {
    background: #e74c3c;
    border: 2px solid #e74c3c;

    &:hover {
      background: #c0392b;
      border-color: #c0392b;
    }
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

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <LoginPrompt>
            <h3>Войдите в систему</h3>
            <p>Для просмотра профиля необходимо войти в систему</p>
            <Button onClick={() => navigate('/login')}>
              Войти
            </Button>
          </LoginPrompt>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <Title>Профиль</Title>
        
        <ProfileCard>
          <BonusPoints>
            <BonusTitle>Бонусные баллы</BonusTitle>
            <BonusAmount>{user.bonusPoints}</BonusAmount>
          </BonusPoints>

          <ProfileSection>
            <SectionTitle>Личная информация</SectionTitle>
            <InfoRow>
              <Label>Имя:</Label>
              <Value>{user.name}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Email:</Label>
              <Value>{user.email}</Value>
            </InfoRow>
            {user.phone && (
              <InfoRow>
                <Label>Телефон:</Label>
                <Value>{user.phone}</Value>
              </InfoRow>
            )}
          </ProfileSection>

          <ActionButtons>
            <Button onClick={() => navigate('/orders')}>
              Мои заказы
            </Button>
            <Button className="secondary" onClick={() => navigate('/tours')}>
              Перейти к турам
            </Button>
            <Button className="danger" onClick={logout}>
              Выйти
            </Button>
          </ActionButtons>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;






