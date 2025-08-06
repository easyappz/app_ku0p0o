import React, { useState } from 'react';
import { Form, Upload, Button, message, Select, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../api/photos';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const UploadPhoto = () => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error('Пожалуйста, загрузите фотографию');
      return;
    }

    const file = fileList[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadPhoto({
          imageData: reader.result,
          gender: values.gender,
          age: Number(values.age),
        });
        message.success('Фотография успешно загружена');
        navigate('/profile');
      } catch (error) {
        message.error(error.response?.data?.message || 'Ошибка при загрузке фото');
      }
    };
    reader.readAsDataURL(file.originFileObj);
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      if (file.size > 1024 * 1024) {
        message.error('Размер изображения не должен превышать 1MB');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    accept: 'image/*',
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Загрузить фотографию
      </Title>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item label='Фотография'>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
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
          <input type='number' min={18} max={100} style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 2 }} placeholder='Введите возраст' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Загрузить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadPhoto;