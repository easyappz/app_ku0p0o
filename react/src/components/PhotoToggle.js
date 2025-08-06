import React, { useState } from 'react';
import { Button, message } from 'antd';
import { togglePhotoStatus } from '../api/photoApi';

const PhotoToggle = ({ photoId, isActive, userPoints, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isActive && userPoints <= 0) {
      message.error('У вас недостаточно баллов для включения фото в оценку.');
      return;
    }

    setLoading(true);
    try {
      await togglePhotoStatus(photoId, !isActive);
      message.success(`Фото ${isActive ? 'отключено' : 'включено'} для оценки.`);
      onToggle();
    } catch (error) {
      message.error('Не удалось изменить статус фото.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type={isActive ? 'default' : 'primary'}
      onClick={handleToggle}
      loading={loading}
      style={{ marginLeft: 8 }}
    >
      {isActive ? 'Отключить от оценки' : 'Включить для оценки'}
    </Button>
  );
};

export default PhotoToggle;
