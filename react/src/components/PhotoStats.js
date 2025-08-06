import React, { useState, useEffect } from 'react';
import { Card, Table, message, Switch } from 'antd';
import { getPhotos, togglePhotoStatus } from '../api/photoApi';

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

  const handleToggleStatus = async (photoId, isActive) => {
    try {
      await togglePhotoStatus(photoId, isActive);
      message.success(`Фото ${isActive ? 'активировано' : 'деактивировано'} для оценки.`);
      setPhotos(photos.map(photo => 
        photo.id === photoId ? { ...photo, isActive } : photo
      ));
    } catch (error) {
      message.error(error.response?.data?.message || 'Не удалось изменить статус фото.');
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
      title: 'Активно для оценки',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={(checked) => handleToggleStatus(record.id, checked)} 
        />
      ),
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (text) => new Date(text).toLocaleDateString(),
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
