import React from 'react';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>Добро пожаловать в Оценку Фото</Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
        Загружайте свои фотографии и получайте оценки от других пользователей. Оценивайте фотографии
        других и зарабатывайте баллы!
      </Paragraph>
      {token ? (
        <div>
          <Link to='/upload'>
            <Button type='primary' style={{ marginRight: 16 }}>
              Загрузить фото
            </Button>
          </Link>
          <Link to='/rate'>
            <Button type='default'>Оценить фото</Button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to='/login'>
            <Button type='primary' style={{ marginRight: 16 }}>
              Войти
            </Button>
          </Link>
          <Link to='/register'>
            <Button type='default'>Зарегистрироваться</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;