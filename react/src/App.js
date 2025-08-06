import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import { HomeOutlined, StarOutlined, BarChartOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import PointsDisplay from './components/PointsDisplay';
import PhotoRating from './components/PhotoRating';
import PhotoStats from './components/PhotoStats';
import UploadPhoto from './pages/UploadPhoto';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { getUserStats } from './api/photoApi';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [points, setPoints] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserStats();
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      const stats = await getUserStats();
      setPoints(stats.totalRatings || 0);
    } catch (error) {
      message.error('Не удалось загрузить данные пользователя.');
    }
  };

  const handlePointsUpdate = (newPoints) => {
    setPoints(newPoints);
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Главная',
    },
    {
      key: 'rating',
      icon: <StarOutlined />,
      label: 'Оценить фото',
    },
    {
      key: 'upload',
      icon: <UploadOutlined />,
      label: 'Загрузить фото',
    },
    {
      key: 'stats',
      icon: <BarChartOutlined />,
      label: 'Статистика',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
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
                        element={<PhotoStats userId="placeholder-user-id" />}
                      />
                      <Route
                        path="/upload"
                        element={
                          <UploadPhoto userPoints={points} onPointsUpdate={handlePointsUpdate} />
                        }
                      />
                      <Route
                        path="/profile"
                        element={<Profile />}
                      />
                      <Route
                        path="/"
                        element={<div>Добро пожаловать! Выберите раздел в меню.</div>}
                      />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
