import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message } from 'antd';
import { getUserStats } from '../api/photoApi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Assuming user data is stored in localStorage or fetched from an endpoint
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      // Mock user data for now
      const stats = await getUserStats();
      setUser({
        email: 'user@example.com',
        username: 'Пользователь',
        gender: 'male',
        age: 25,
        points: stats.points || 0,
      });
    } catch (error) {
      message.error('Не удалось загрузить данные профиля.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Вы вышли из системы.');
    navigate('/login');
  };

  return (
    <Card title="Профиль пользователя" loading={loading} style={{ maxWidth: 600, margin: '0 auto', marginTop: 20 }}>
      {user && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Имя пользователя">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Пол">{
            user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Другое'
          }</Descriptions.Item>
          <Descriptions.Item label="Возраст">{user.age}</Descriptions.Item>
          <Descriptions.Item label="Баллы">{user.points}</Descriptions.Item>
        </Descriptions>
      )}
      <Button type="primary" danger onClick={handleLogout} style={{ marginTop: 16 }}>
        Выйти
      </Button>
    </Card>
  );
};

export default Profile;
