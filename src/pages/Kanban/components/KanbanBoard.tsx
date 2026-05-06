import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Badge, Tag, Typography } from 'antd';
import { EditOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Paragraph, Text } = Typography;

interface Props {
  onEditTask: (task: Kanban.Task) => void;
}

const statusLabels: Record<string, string> = {
  todo: 'Cần làm',
  inprogress: 'Đang làm',
  done: 'Hoàn thành',
};

const priorityColors = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
};

const TaskCard = ({ task, onEdit }: { task: Kanban.Task; onEdit: (task: Kanban.Task) => void }) => {
  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderLeft: `4px solid ${priorityColors[task.priority]}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
      actions={[
        <EditOutlined key="edit" onClick={() => onEdit(task)} />,
      ]}
    >
      <Card.Meta
        title={task.title}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ margin: 0 }}>
              {task.description}
            </Paragraph>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Text type="secondary">
                <ClockCircleOutlined /> {new Date(task.deadline).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                <CheckCircleOutlined /> {statusLabels[task.status]}
              </Text>
            </div>
            <div style={{ marginTop: 10 }}>
              {task.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ({ onEditTask }: Props) => {
  const { tasks, moveTask } = useModel('kanban');

  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    inprogress: tasks.filter((t) => t.status === 'inprogress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      moveTask(draggableId, destination.droppableId as Kanban.Task['status']);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        {Object.entries(columns).map(([status, list]) => (
          <div key={status} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{statusLabels[status]}</h3>
                <Text type="secondary">{list.length} task</Text>
              </div>
              <Badge count={list.length} />
            </div>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: 520, padding: 12, background: '#f8f8f8', borderRadius: 8 }}
                >
                  {list.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} onEdit={onEditTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: '12px 16px', background: '#fff7e6', borderRadius: 8, border: '1px solid #ffe7ba' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 12, color: '#595959' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: '#ff4d4f', borderRadius: 3, display: 'inline-block' }} />
            <span>Cao</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: '#faad14', borderRadius: 3, display: 'inline-block' }} />
            <span>Trung bình</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: '#52c41a', borderRadius: 3, display: 'inline-block' }} />
            <span>Thấp</span>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};