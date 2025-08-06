import React from 'react';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const AuthForm = ({ title, onFinish, submitText, children }) => {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        {title}
      </Title>
      <Form name='auth-form' layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='email'
          label='Электронная почта'
          rules={[{ required: true, message: 'Введите вашу почту', type: 'email' }]}
        >
          <Input placeholder='Введите email' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Пароль'
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder='Введите пароль' />
        </Form.Item>
        {children}
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AuthForm;