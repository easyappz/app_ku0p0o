import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';

const { Title } = Typography;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }
    try {
      await resetPassword({
        token,
        newPassword: values.password,
      });
      message.success('Пароль успешно сброшен. Войдите с новым паролем.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при сбросе пароля');
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
        <Title level={2}>Ошибка</Title>
        <p>Отсутствует токен для сброса пароля. Пожалуйста, запросите сброс пароля заново.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Новый пароль
      </Title>
      <Form name='reset-password' layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='password'
          label='Новый пароль'
          rules={[{ required: true, message: 'Введите новый пароль' }]}
        >
          <Input.Password placeholder='Введите новый пароль' />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          label='Подтвердите пароль'
          rules={[{ required: true, message: 'Подтвердите новый пароль' }]}
        >
          <Input.Password placeholder='Подтвердите новый пароль' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;