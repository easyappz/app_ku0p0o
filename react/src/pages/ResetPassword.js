import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { resetPassword } from '../api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await resetPassword({ token, newPassword: values.newPassword });
      message.success('Пароль успешно сброшен. Войдите с новым паролем.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при сбросе пароля.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Новый пароль" style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
      <Form
        name="resetPassword"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="newPassword"
          label="Новый пароль"
          rules={[{ required: true, message: 'Введите новый пароль', min: 6 }]}
        >
          <Input.Password placeholder="Введите новый пароль" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Подтвердите пароль"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Подтвердите пароль" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Сбросить пароль
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

export default ResetPassword;
