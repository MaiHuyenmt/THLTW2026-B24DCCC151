import React, { useState } from 'react';
import { Table, Button, Input, Select, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;
const { Search } = Input;

interface Props {
  onEditTask: (task: Kanban.Task) => void;
  onAddTask: () => void;
}

const statusLabels: Record<string, string> = {
  todo: 'Cần làm',
  inprogress: 'Đang làm',
  done: 'Hoàn thành',
};

export default ({ onEditTask, onAddTask }: Props) => {
  const { tasks, deleteTask } = useModel('kanban');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredTasks = tasks.filter((task) => {
    const containsSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return containsSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Công việc',
      dataIndex: 'title',
      sorter: (a: Kanban.Task, b: Kanban.Task) => a.title.localeCompare(b.title),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      render: (deadline: string) => new Date(deadline).toLocaleDateString(),
      sorter: (a: Kanban.Task, b: Kanban.Task) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      render: (priority: string) => (
        <Tag color={priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'}>
          {priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </Tag>
      ),
      filters: [
        { text: 'Cao', value: 'high' },
        { text: 'Trung bình', value: 'medium' },
        { text: 'Thấp', value: 'low' },
      ],
      onFilter: (value: string, record: Kanban.Task) => record.priority === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'done' ? 'green' : status === 'inprogress' ? 'blue' : 'default'}>
          {statusLabels[status]}
        </Tag>
      ),
      filters: [
        { text: 'Cần làm', value: 'todo' },
        { text: 'Đang làm', value: 'inprogress' },
        { text: 'Hoàn thành', value: 'done' },
      ],
      onFilter: (value: string, record: Kanban.Task) => record.status === value,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags: string[]) => tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Kanban.Task) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditTask(record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => deleteTask(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Tìm theo tên hoặc mô tả"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          placeholder="Lọc theo trạng thái"
          onChange={setStatusFilter}
          style={{ width: 180 }}
          allowClear
        >
          <Option value="todo">Cần làm</Option>
          <Option value="inprogress">Đang làm</Option>
          <Option value="done">Hoàn thành</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
          Tạo task mới
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};