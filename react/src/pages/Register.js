import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { register } from '../api/auth';

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await register({
        email: values.email,
        password: values.password,
        username: values.username,
        gender: values.gender,
        age: Number(values.age),
      });
      localStorage.setItem('token', data.token);
      message.success('Регистрация успешна!');
      navigate('/profile');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <AuthForm title='Регистрация' onFinish={onFinish} submitText='Зарегистрироваться'>
      <Form.Item
        name='username'
        label='Имя пользователя'
        rules={[{ required: true, message: 'Введите имя пользователя' }]}
      >
        <Input placeholder='Введите имя пользователя' />
      </Form.Item>
      <Form.Item
        name='gender'
        label='Пол'
        rules={[{ required: true, message: 'Выберите пол' }]}
      >
        <Select placeholder='Выберите пол'>
          <Option value='male'>Мужчина</Option>
          <Option value='female'>Женщина</Option>
          <Option value='other'>Другое</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name='age'
        label='Возраст'
        rules={[{ required: true, message: 'Введите возраст' }]}
      >
        <Input type='number' placeholder='Введите возраст' min={18} max={100} />
      </Form.Item>
    </AuthForm>
  );
};

export default Register;