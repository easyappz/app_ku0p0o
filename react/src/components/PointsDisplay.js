import React from 'react';
import { Typography, Card } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PointsDisplay = ({ points }) => {
  return (
    <Card style={{ marginBottom: 16, textAlign: 'center' }}>
      <StarOutlined style={{ fontSize: 24, color: '#ffd700', marginRight: 8 }} />
      <Text strong>Ваши баллы: {points}</Text>
    </Card>
  );
};

export default PointsDisplay;
