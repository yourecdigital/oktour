import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #1e293b;
  margin-bottom: 30px;
  font-size: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1e293b;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(255, 215, 0, 0.35);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
`;

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password
      });
      
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Успешный вход в админ-панель');
      navigate('/admin/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка входа';
      setError(message);
      toast.error(message);
    }
    
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Вход в админ-панель</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Имя пользователя</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Пароль</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;

