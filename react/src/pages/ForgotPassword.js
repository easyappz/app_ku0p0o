import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { requestPasswordReset } from '../api/auth';

const { Title } = Typography;

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    try {
      await requestPasswordReset({ email: values.email });
      message.success('Инструкции по сбросу пароля отправлены на вашу почту');
      setSubmitted(true);
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при запросе сброса пароля');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Сброс пароля
      </Title>
      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <p>Проверьте вашу почту для получения инструкций по сбросу пароля.</p>
        </div>
      ) : (
        <Form name='forgot-password' layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='email'
            label='Электронная почта'
            rules={[{ required: true, message: 'Введите вашу почту', type: 'email' }]}
          >
            <Input placeholder='Введите email' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
              Отправить
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;