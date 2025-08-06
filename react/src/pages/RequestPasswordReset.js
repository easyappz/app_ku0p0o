import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { requestPasswordReset } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const RequestPasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await requestPasswordReset(values);
      message.success('Запрос на сброс пароля отправлен. Проверьте email.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при запросе сброса пароля.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Сброс пароля" style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
      <Form
        name="requestReset"
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Отправить запрос
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/login')}>
          Вернуться ко входу
        </Button>
      </div>
    </Card>
  );
};

export default RequestPasswordReset;
