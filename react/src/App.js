import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import { HomeOutlined, StarOutlined, BarChartOutlined } from '@ant-design/icons';
import PointsDisplay from './components/PointsDisplay';
import PhotoRating from './components/PhotoRating';
import PhotoStats from './components/PhotoStats';
import { getUserStats } from './api/photoApi';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [points, setPoints] = useState(10);
  const [userId, setUserId] = useState('placeholder-user-id'); // Replace with actual user ID from auth
  const [selectedMenu, setSelectedMenu] = useState('rating');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const stats = await getUserStats();
      setPoints(stats.points || 10); // Assuming points are part of stats response
    } catch (error) {
      message.error('Не удалось загрузить данные пользователя.');
    }
  };

  const handlePointsUpdate = (newPoints) => {
    setPoints(newPoints);
  };

  const menuItems = [
    {
      key: 'rating',
      icon: <StarOutlined />,
      label: 'Оценить фото',
    },
    {
      key: 'stats',
      icon: <BarChartOutlined />,
      label: 'Статистика',
    },
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Главная',
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={({ key }) => setSelectedMenu(key)}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Header style={{ padding: 0, background: '#fff', textAlign: 'center' }}>
            <h1>Приложение для оценки фото</h1>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <PointsDisplay points={points} />
            <Routes>
              <Route
                path="/rating"
                element={
                  <PhotoRating userPoints={points} onPointsUpdate={handlePointsUpdate} />
                }
              />
              <Route
                path="/stats"
                element={<PhotoStats userId={userId} />}
              />
              <Route
                path="/"
                element={<div>Добро пожаловать! Выберите раздел в меню.</div>}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
