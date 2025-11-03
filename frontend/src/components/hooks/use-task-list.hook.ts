import { useState, useEffect } from 'react';
import type { Task, UpdateTaskDto } from '../../providers/tasks/tasks.types';

interface UseTaskListProps {
  fetchedTasks?: Task[];
  updateTask: (id: number, updates: UpdateTaskDto) => void;
  filterFunc: (task: Task) => boolean;
}

export function useTaskList({ fetchedTasks, updateTask, filterFunc }: UseTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks.filter(filterFunc));
    }
  }, [fetchedTasks, filterFunc]);

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    );

    const toggled = tasks.find(task => task.id === id);
    if (toggled) {
      const newStatus = toggled.status === 'done' ? 'todo' : 'done';
      updateTask(id, { status: newStatus });
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.status === 'done').length;
  const totalCount = tasks.length;

  return {
    tasks,
    toggleTask,
    deleteTask,
    completedCount,
    totalCount,
  };
}