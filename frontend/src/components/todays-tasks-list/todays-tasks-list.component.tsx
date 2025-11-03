import { useCallback } from 'react';
import type { Task, UpdateTaskDto } from '../../providers/tasks/tasks.types';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '../checkbox/checkbox.component';
import { useTaskList } from '../hooks/use-task-list.hook';

import './todays-tasks-list.style.css';

interface TodaysTasksListProps {
  fetchedTasks?: Task[];
  updateTask: (id: number, updates: UpdateTaskDto) => void;
}

export default function TodaysTasksList({ fetchedTasks, updateTask }: TodaysTasksListProps) {
  const filterToday = useCallback((task: Task) => {
    const today = new Date().toISOString().split('T')[0];
    return task.due_at.toString().startsWith(today);
  }, []);

  const { tasks, toggleTask, deleteTask, completedCount, totalCount } = useTaskList({
    fetchedTasks,
    updateTask,
    filterFunc: filterToday,
  });

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="tasks-title">Today's Tasks</h2>
        <p className="tasks-progress-text">
          {completedCount} of {totalCount} completed
        </p>
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="tasks-empty">No tasks yet :( </p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <Checkbox task={task} toggleTask={toggleTask} />
              <span className={`task-text ${task.status === 'done' ? 'task-text-completed' : ''}`}>
                {task.title}
              </span>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="task-delete-btn"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}