import React, { useState } from 'react';
import { Card, Upload, Button, message, Form, Select, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPhoto } from '../api/photoApi';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const UploadPhoto = ({ userPoints, onPointsUpdate }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error('Пожалуйста, загрузите фото.');
      return;
    }

    setLoading(true);
    try {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        await uploadPhoto({ ...values, imageData });
        message.success('Фото успешно загружено!');
        onPointsUpdate(userPoints - 10); // Assuming 10 points are deducted for upload
        navigate('/stats');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при загрузке фото.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Можно загружать только изображения!');
        return false;
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error('Размер изображения должен быть меньше 1MB!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <Card title="Загрузить фото" style={{ maxWidth: 600, margin: '0 auto', marginTop: 20 }}>
      <Form
        name="uploadPhoto"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ gender: 'male', age: 25 }}
      >
        <Form.Item
          name="upload"
          label="Выберите фото (до 1MB)"
          rules={[{ required: true, message: 'Загрузите фото' }]}
        >
          <Upload {...uploadProps} accept="image/*">
            <Button icon={<UploadOutlined />}>Выбрать фото</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Пол на фото"
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
          label="Возраст на фото"
          rules={[{ required: true, message: 'Введите возраст' }]}
        >
          <InputNumber min={18} max={100} placeholder="Введите возраст" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Загрузить фото (стоимость: 10 баллов)
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UploadPhoto;
