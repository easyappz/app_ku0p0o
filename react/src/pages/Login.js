import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const data = await login({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem('token', data.token);
      message.success('Вход успешен!');
      navigate('/profile');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при входе');
    }
  };

  return (
    <AuthForm title='Вход' onFinish={onFinish} submitText='Войти'>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Link to='/forgot-password'>Забыли пароль?</Link>
      </div>
    </AuthForm>
  );
};

export default Login;