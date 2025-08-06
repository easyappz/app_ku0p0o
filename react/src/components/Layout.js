import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined, UploadOutlined, StarOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to='/'>Главная</Link>,
    },
    ...(token
      ? [
          {
            key: '/profile',
            icon: <UserOutlined />,
            label: <Link to='/profile'>Профиль</Link>,
          },
          {
            key: '/upload',
            icon: <UploadOutlined />,
            label: <Link to='/upload'>Загрузить фото</Link>,
          },
          {
            key: '/rate',
            icon: <StarOutlined />,
            label: <Link to='/rate'>Оценить фото</Link>,
          },
        ]
      : []),
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px', marginRight: '20px' }}>Оценка Фото</div>
        <Menu
          theme='dark'
          mode='horizontal'
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1 }}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 24 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Оценка Фото ©2023</Footer>
    </AntLayout>
  );
};

export default Layout;