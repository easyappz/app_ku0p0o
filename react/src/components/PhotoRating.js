import React, { useState, useEffect } from 'react';
import { Card, Image, Rate, Button, message, Form, Select, Slider } from 'antd';
import { getNextPhoto, ratePhoto } from '../api/photoApi';

const { Option } = Select;

const PhotoRating = ({ userPoints, onPointsUpdate }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ gender: '', minAge: 18, maxAge: 100 });

  useEffect(() => {
    fetchNextPhoto();
  }, [filters]);

  const fetchNextPhoto = async () => {
    setLoading(true);
    try {
      const nextPhoto = await getNextPhoto(filters);
      setPhoto(nextPhoto);
    } catch (error) {
      message.error('Не удалось загрузить фото для оценки.');
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (value) => {
    if (!photo) return;

    try {
      await ratePhoto(photo.id, value);
      message.success('Оценка сохранена! Вы получили 1 балл.');
      onPointsUpdate(userPoints + 1);
      fetchNextPhoto();
    } catch (error) {
      message.error('Не удалось оценить фото.');
    }
  };

  const handleFilterChange = (changedValues) => {
    setFilters((prev) => ({ ...prev, ...changedValues }));
  };

  return (
    <div>
      <Card title="Фильтры" style={{ marginBottom: 16 }}>
        <Form layout="vertical" onValuesChange={handleFilterChange} initialValues={filters}>
          <Form.Item name="gender" label="Пол">
            <Select placeholder="Выберите пол">
              <Option value="">Все</Option>
              <Option value="male">Мужской</Option>
              <Option value="female">Женский</Option>
              <Option value="other">Другое</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ageRange" label="Возрастной диапазон">
            <Slider
              range
              min={18}
              max={100}
              defaultValue={[filters.minAge, filters.maxAge]}
              onChange={(value) => handleFilterChange({ minAge: value[0], maxAge: value[1] })}
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Оценить фото" loading={loading} style={{ textAlign: 'center' }}>
        {photo ? (
          <>
            <Image
              src={photo.imageData}
              alt="Фото для оценки"
              style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', marginBottom: 16 }}
            />
            <div style={{ marginBottom: 16 }}>
              <Rate allowHalf onChange={handleRate} />
            </div>
            <p>Автор: {photo.username}</p>
            <p>Пол: {photo.gender === 'male' ? 'Мужской' : photo.gender === 'female' ? 'Женский' : 'Другое'}</p>
            <p>Возраст: {photo.age}</p>
          </>
        ) : (
          <p>Нет доступных фото для оценки с текущими фильтрами.</p>
        )}
      </Card>
    </div>
  );
};

export default PhotoRating;
