import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Card, message } from 'antd';
import { register } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await register(values);
      message.success('Регистрация успешна! Вы вошли в систему.');
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при регистрации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Регистрация" style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ gender: 'male', age: 25 }}
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
          rules={[{ required: true, message: 'Введите пароль', min: 6 }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Имя пользователя"
          rules={[{ required: true, message: 'Введите имя пользователя' }]}
        >
          <Input placeholder="Введите имя пользователя" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: 'Выберите пол' }]}
        >
          <Select placeholder="Выберите пол">
            <Option value="male">Мужской</Option>
            <Option value="female">Женский</Option>
            <Option value="other">Другое</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="age"
          label="Возраст"
          rules={[{ required: true, message: 'Введите возраст' }]}
        >
          <InputNumber min={18} max={100} placeholder="Введите возраст" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/login')}>
          Уже есть аккаунт? Войти
        </Button>
      </div>
    </Card>
  );
};

export default Register;
