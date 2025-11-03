import { useMemo } from 'react';
import type { Task } from './task.types.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';

import './task.style.css';

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
}

export default function TaskItem({ task, toggleTask }: TaskItemProps) {
  const formatDueDate = useMemo(() => (date: Date) => {
    const formattedDate = new Date(date);
    const now = new Date();
    const isOverdue = formattedDate < now && task.status !== 'done';

    return {
      formatted: formattedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: formattedDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }),
      isOverdue
    };
  }, [task.status]);

  const { formatted: 
    dueDate,
    isOverdue 
  } = formatDueDate(task.due_at);

  const getStatusLabel = (status: Task['status']) => {
    return {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    }[status];
  };

  return (
    <li 
      className={`taskItem ${task.status === 'done' ? 'taskItemCompleted' : ''}`}
    >
      <div className="taskHeader">
        <Checkbox task={task} toggleTask={toggleTask} />
        <div className="taskContent">
          <div className="taskTitleRow">
            <span className="taskText">{task.title}</span>
            <span className={`taskStatus taskStatus--${task.status}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          
          {task.description && (
            <p className="taskDescription">{task.description}</p>
          )}
          
          <div className="taskMeta">
            <span className={`taskDueDate ${isOverdue ? 'taskOverdue' : ''}`}>
              {isOverdue}Due: {dueDate}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}