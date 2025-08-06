import React, { useState, useEffect } from 'react';
import { Card, Table, message } from 'antd';
import { getPhotos } from '../api/photoApi';

const PhotoStats = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await getPhotos();
      const userPhotos = data.filter((photo) => photo.userId === userId);
      setPhotos(userPhotos);
    } catch (error) {
      message.error('Не удалось загрузить статистику по фото.');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Фото',
      dataIndex: 'imageData',
      key: 'imageData',
      render: (text) => (
        <img src={text} alt="Фото" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Средняя оценка',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (text) => text.toFixed(2),
    },
    {
      title: 'Пол оценивших',
      dataIndex: 'ratingGender',
      key: 'ratingGender',
      render: () => 'Данные недоступны', // Placeholder, as detailed stats per rating are not in API
    },
    {
      title: 'Возраст оценивших',
      dataIndex: 'ratingAge',
      key: 'ratingAge',
      render: () => 'Данные недоступны', // Placeholder, as detailed stats per rating are not in API
    },
  ];

  return (
    <Card title="Статистика ваших фото" loading={loading}>
      <Table
        dataSource={photos}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: 'У вас пока нет загруженных фото.' }}
      />
    </Card>
  );
};

export default PhotoStats;
