import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
      message.success('Вход успешен!');
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при входе.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Вход" style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
        >
          <Input placeholder="Введите email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/register')}>
          Нет аккаунта? Зарегистрироваться
        </Button>
        <br />
        <Button type="link" onClick={() => navigate('/request-reset')}>
          Забыли пароль?
        </Button>
      </div>
    </Card>
  );
};

export default Login;
