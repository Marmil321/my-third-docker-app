import { useState, useCallback, type ReactNode } from 'react';
import { TasksContext } from './tasks.context';
import type { Task, CreateTaskDto, UpdateTaskDto } from './tasks.types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/tasks`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setTasks(result.data);
      }
    } catch (err) {
      setError((err as Error).message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);


  async function createTask(taskData: CreateTaskDto) {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/task/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }

  async function updateTask(id: number, updates: UpdateTaskDto) {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }

  async function deleteTask(id: number) {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}