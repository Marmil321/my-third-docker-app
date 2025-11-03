import { useState, useCallback } from 'react';
import type { Task, UpdateTaskDto } from '../../providers/tasks/tasks.types';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '../checkbox/checkbox.component';
import { useTaskList } from '../hooks/use-task-list.hook';

import './upcoming-tasks.style.css';

interface UpcomingTasksListProps {
  fetchedTasks?: Task[];
  updateTask: (id: number, updates: UpdateTaskDto) => void;
}

export default function UpcomingTasksList({ fetchedTasks, updateTask }: UpcomingTasksListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterUpcoming = useCallback(
    (task: Task) => new Date(task.due_at) > new Date(new Date().setDate(new Date().getDate())),
    []
  );

  const { tasks, toggleTask, deleteTask, completedCount, totalCount } = useTaskList({
    fetchedTasks,
    updateTask,
    filterFunc: filterUpcoming,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = date.toISOString().split('T')[0];
    const tomorrowOnly = tomorrow.toISOString().split('T')[0];

    if (dateOnly === tomorrowOnly) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="upcoming-tasks-container">
      <div 
        className="upcoming-tasks-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="upcoming-header-content">
          <h2 className="upcoming-tasks-title">Upcoming Tasks</h2>
          <span className="upcoming-tasks-count">
            {totalCount} task{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="upcoming-toggle-btn">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {isExpanded && (
        <>
          {totalCount > 0 && (
            <div className="upcoming-progress-section">
              <p className="upcoming-progress-text">
                {completedCount} of {totalCount} completed
              </p>
              <div className="progress-bar-background">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          <div className="upcoming-tasks-list">
            {tasks.length === 0 ? (
              <p className="upcoming-tasks-empty">No upcoming tasks</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="upcoming-task-item">
                  <Checkbox task={task} toggleTask={toggleTask} />
                  <div className="upcoming-task-content">
                    <span className={`upcoming-task-text ${task.status === 'done' ? 'upcoming-task-text-completed' : ''}`}>
                      {task.title}
                    </span>
                    <span className="upcoming-task-date">
                      {formatDate(task.due_at.toString())}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="upcoming-task-delete-btn"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}