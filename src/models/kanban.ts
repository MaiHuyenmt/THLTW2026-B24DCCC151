import { useState, useEffect } from 'react';

const defaultTasks: Kanban.Task[] = [
  {
    id: 'task-1',
    title: 'Xây dựng giao diện Dashboard',
    description: 'Thiết kế màn hình tổng quan và thẻ thống kê task cho ứng dụng quản lý công việc.',
    deadline: '2026-05-08T18:00:00.000Z',
    priority: 'high',
    tags: ['UI/UX', 'React'],
    status: 'todo',
    createdAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Tích hợp Drag and Drop',
    description: 'Sử dụng react-beautiful-dnd để kéo thả task giữa các cột trong Bảng Kanban.',
    deadline: '2026-05-11T18:00:00.000Z',
    priority: 'medium',
    tags: ['Frontend'],
    status: 'inprogress',
    createdAt: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'task-3',
    title: 'Kiểm tra lỗi hệ thống',
    description: 'Rà soát các lỗi phát sinh trong quá trình thực hiện và đảm bảo lưu dữ liệu localStorage.',
    deadline: '2026-05-05T18:00:00.000Z',
    priority: 'low',
    tags: ['Testing'],
    status: 'done',
    createdAt: '2026-05-03T12:00:00.000Z',
  },
  {
    id: 'task-4',
    title: 'Tạo trang danh sách Task',
    description: 'Hiển thị task dưới dạng bảng với tính năng lọc, tìm kiếm và sắp xếp theo deadline.',
    deadline: '2026-05-12T18:00:00.000Z',
    priority: 'medium',
    tags: ['Ant Design', 'Table'],
    status: 'todo',
    createdAt: '2026-05-04T09:00:00.000Z',
  },
  {
    id: 'task-5',
    title: 'Thêm/chỉnh sửa task',
    description: 'Thiết kế form nhập đầy đủ thông tin task: tên, mô tả, deadline, mức độ ưu tiên và tag.',
    deadline: '2026-05-10T18:00:00.000Z',
    priority: 'high',
    tags: ['Form', 'UX'],
    status: 'inprogress',
    createdAt: '2026-05-05T14:00:00.000Z',
  },
];

export default () => {
  const [tasks, setTasks] = useState<Kanban.Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Kanban.Task | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  const loadTasks = () => {
    const data = localStorage.getItem('kanban-tasks');
    if (data) {
      setTasks(JSON.parse(data));
    } else {
      setTasks(defaultTasks);
      localStorage.setItem('kanban-tasks', JSON.stringify(defaultTasks));
    }
  };

  const saveTasks = (newTasks: Kanban.Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('kanban-tasks', JSON.stringify(newTasks));
  };

  const addTask = (task: Omit<Kanban.Task, 'id' | 'createdAt'>) => {
    const newTask: Kanban.Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
  };

  const updateTask = (updatedTask: Kanban.Task) => {
    const newTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    saveTasks(newTasks);
  };

  const moveTask = (id: string, newStatus: Kanban.Task['status']) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    saveTasks(newTasks);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const currentTime = new Date(now).getTime();
    const overdue = tasks.filter(
      (t) => t.status !== 'done' && new Date(t.deadline).getTime() < currentTime,
    ).length;
    return { total, completed, overdue };
  };

  return {
    tasks,
    currentTask,
    setCurrentTask,
    isEdit,
    setIsEdit,
    visible,
    setVisible,
    now,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getStats,
  };
};