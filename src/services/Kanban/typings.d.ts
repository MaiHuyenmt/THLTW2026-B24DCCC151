declare module Kanban {
  interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
    status: 'todo' | 'inprogress' | 'done';
    createdAt: string;
  }
}