import React from 'react';
import { Form, Select, Slider, Button } from 'antd';

const { Option } = Select;

const FilterForm = ({ onApply, initialValues = {} }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout='inline'
      initialValues={{
        gender: initialValues.gender || '',
        ageRange: initialValues.ageRange || [18, 60],
      }}
      onFinish={(values) => {
        onApply({
          gender: values.gender,
          minAge: values.ageRange[0],
          maxAge: values.ageRange[1],
        });
      }}
      style={{ marginBottom: 16 }}
    >
      <Form.Item name='gender' label='Пол'>
        <Select placeholder='Выберите пол' style={{ width: 150 }}>
          <Option value=''>Все</Option>
          <Option value='male'>Мужчина</Option>
          <Option value='female'>Женщина</Option>
          <Option value='other'>Другое</Option>
        </Select>
      </Form.Item>
      <Form.Item name='ageRange' label='Возраст'>
        <Slider range min={18} max={100} style={{ width: 200 }} />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Применить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterForm;