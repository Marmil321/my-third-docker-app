import { useState } from 'react';
import type { Task } from '../task/task.types.ts';
import TaskItem from '../task/task.component.tsx';
import { PencilLine, Trash2  } from 'lucide-react';

import './editable-task.style.css';

interface EditableTaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

export default function EditableTaskItem({ task, toggleTask, updateTask, deleteTask }: EditableTaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    due_at: task.due_at,
    status: task.status
  });

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleDelete = () => {
    deleteTask(task.id);
  }

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description || '',
      due_at: task.due_at,
      status: task.status
    });
    setIsEditing(false);
  };

  const formatDateForInput = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  if (isEditing) {
    return (
      <li className={`taskItem ${task.status === 'done' ? 'taskItemCompleted' : ''}`}>
        <div className="taskHeader">
          <div className="taskContent">
            <div className="taskEditForm">
              <div className="taskTitleRow">
                <input
                  type="text"
                  className="taskEditInput taskEditTitle"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  placeholder="Task title"
                />
                <select
                  className="taskEditSelect"
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <textarea
                className="taskEditInput taskEditDescription"
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
              />
              
              <div className="taskEditMeta">
                <label className="taskEditLabel">
                  Due:
                  <input
                    type="date"
                    className="taskEditInput taskEditDate"
                    value={formatDateForInput(editedTask.due_at)}
                    onChange={(e) => setEditedTask({ ...editedTask, due_at: new Date(e.target.value) })}
                  />
                </label>
              </div>

              <div className="taskEditActions">
                <button className="taskEditButton taskEditSave" onClick={handleSave}>
                  Save
                </button>
                <button className="taskEditButton taskEditCancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="editableTaskWrapper">
      <TaskItem task={task} toggleTask={toggleTask} />
      <button className="taskEditTrigger" onClick={handleEdit}>
        <PencilLine size={16} />
      </button>
      <button className='taskDeleteBtn' onClick={handleDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}