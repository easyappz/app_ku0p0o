import React, { useState, useEffect } from 'react';
import { Typography, Statistic, Row, Col, Card, List, Switch, message } from 'antd';
import { getStats, getPhotos, togglePhotoStatus } from '../api/photos';
import { getStats as getUserStats } from '../api/stats';
import PhotoCard from '../components/PhotoCard';

const { Title } = Typography;

const Profile = () => {
  const [stats, setStats] = useState({ totalPhotos: 0, totalRatings: 0, averageScore: 0 });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getUserStats();
        setStats(statsData);
        const photosData = await getPhotos();
        setPhotos(photosData.filter((photo) => photo.userId === localStorage.getItem('userId')));
      } catch (error) {
        message.error('Ошибка при загрузке данных профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleStatus = async (photoId, isActive) => {
    try {
      await togglePhotoStatus({ photoId, isActive });
      setPhotos(photos.map((photo) =>
        photo.id === photoId ? { ...photo, isActive } : photo
      ));
      message.success('Статус фото обновлен');
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  };

  return (
    <div>
      <Title level={2}>Профиль пользователя</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic title='Всего фото' value={stats.totalPhotos} loading={loading} />
        </Col>
        <Col span={8}>
          <Statistic title='Всего оценок' value={stats.totalRatings} loading={loading} />
        </Col>
        <Col span={8}>
          <Statistic
            title='Средняя оценка'
            value={stats.averageScore.toFixed(1)}
            loading={loading}
          />
        </Col>
      </Row>
      <Title level={3}>Ваши фотографии</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={photos}
        loading={loading}
        renderItem={(photo) => (
          <List.Item>
            <Card>
              <PhotoCard photo={photo} />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <span style={{ marginRight: 8 }}>Доступно для оценки:</span>
                <Switch
                  checked={photo.isActive}
                  onChange={(checked) => handleToggleStatus(photo.id, checked)}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Profile;