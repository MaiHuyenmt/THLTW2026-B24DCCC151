import React, { useState } from 'react';
import { Layout, Menu, Button, PageHeader } from 'antd';
import { DashboardOutlined, UnorderedListOutlined, TableOutlined, PlusOutlined } from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { useModel } from 'umi';

const { Sider, Content } = Layout;

const menuItems = [
  { label: 'Dashboard', key: 'dashboard', icon: <DashboardOutlined /> },
  { label: 'Bảng Kanban', key: 'kanban', icon: <UnorderedListOutlined /> },
  { label: 'Danh sách Task', key: 'list', icon: <TableOutlined /> },
];

export default () => {
  const { visible, setVisible, currentTask, setCurrentTask, isEdit, setIsEdit } = useModel('kanban');
  const [selectedView, setSelectedView] = useState('dashboard');

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsEdit(false);
    setVisible(true);
  };

  const handleEditTask = (task: Kanban.Task) => {
    setCurrentTask(task);
    setIsEdit(true);
    setVisible(true);
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 48px)', background: '#fff' }}>
      <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedView]}
          items={menuItems}
          onClick={({ key }) => setSelectedView(key)}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <PageHeader
          title="Bảng quản lý công việc"
          subTitle="Quản lý task theo Kanban và danh sách nhiệm vụ"
          extra={[
            <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
              Tạo task mới
            </Button>,
          ]}
        />
        <Content style={{ padding: 24, background: '#fff' }}>
          {selectedView === 'dashboard' && <Dashboard onAddTask={handleAddTask} />}
          {selectedView === 'kanban' && <KanbanBoard onEditTask={handleEditTask} />}
          {selectedView === 'list' && <TaskList onEditTask={handleEditTask} onAddTask={handleAddTask} />}
        </Content>
      </Layout>
      <TaskForm />
    </Layout>
  );
};