import React, { useState, useEffect } from 'react';
import { Typography, Button, message, Spin } from 'antd';
import { getNextPhoto, ratePhoto } from '../api/photos';
import PhotoCard from '../components/PhotoCard';
import FilterForm from '../components/FilterForm';

const { Title } = Typography;

const RatePhotos = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchNextPhoto = async () => {
    setLoading(true);
    try {
      const nextPhoto = await getNextPhoto(filters);
      setPhoto(nextPhoto);
    } catch (error) {
      if (error.response?.status === 404) {
        message.info('Фотографии для оценки закончились');
        setPhoto(null);
      } else {
        message.error('Ошибка при загрузке фото');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextPhoto();
  }, [filters]);

  const handleRate = async (photoId, score) => {
    try {
      await ratePhoto({ photoId, score });
      message.success('Оценка сохранена');
      fetchNextPhoto();
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при сохранении оценки');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <Title level={2} style={{ textAlign: 'center' }}>
        Оценить фотографии
      </Title>
      <FilterForm onApply={handleApplyFilters} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size='large' />
        </div>
      ) : photo ? (
        <div style={{ textAlign: 'center' }}>
          <PhotoCard photo={photo} onRate={handleRate} />
          <Button onClick={fetchNextPhoto} style={{ marginTop: 16 }}>
            Пропустить
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Title level={3}>Фотографии для оценки отсутствуют</Title>
          <Button onClick={fetchNextPhoto}>Обновить</Button>
        </div>
      )}
    </div>
  );
};

export default RatePhotos;