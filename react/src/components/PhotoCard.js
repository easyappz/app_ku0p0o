import React from 'react';
import { Card, Rate, Typography } from 'antd';

const { Text } = Typography;

const PhotoCard = ({ photo, onRate, disabled = false }) => {
  return (
    <Card
      hoverable
      style={{ width: 240, margin: '0 auto' }}
      cover={<img alt='Фото' src={photo.imageData} style={{ height: 200, objectFit: 'cover' }} />}
    >
      <Card.Meta
        title={photo.username}
        description={
          <>
            <Text>{`${photo.gender === 'male' ? 'Мужчина' : photo.gender === 'female' ? 'Женщина' : 'Другое'}, ${photo.age} лет`}</Text>
            <div>
              <Text>Средняя оценка: {photo.averageScore.toFixed(1)}</Text>
            </div>
            {onRate && (
              <Rate
                value={0}
                onChange={(value) => onRate(photo.id, value)}
                disabled={disabled}
                count={10}
                style={{ fontSize: 16 }}
              />
            )}
          </>
        }
      />
    </Card>
  );
};

export default PhotoCard;