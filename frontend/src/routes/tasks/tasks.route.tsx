import { useState, useEffect } from 'react';
import EditableTask from '../../components/editable-task/editable-task.component.tsx';
import { TasksProvider } from "../../providers/tasks/tasks.provider";
import { useTasksContext } from "../../providers/tasks/tasks.context";
import { CreateTaskModal } from '../../components/create-task-modal/create-task-modal.components';
import { Button } from "../../components/button/button.component";

function TasksContent() {
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } = useTasksContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      await updateTask(taskId, { status: newStatus });
      console.log(`Toggled task ${taskId} to status ${newStatus}`);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1>Your tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Create Task
        </Button>
      </div> 
      <div
        className='task-divider'
        style={{
          width: '100%',
          height: '2px',
          background: 'linear-gradient(to right, #1abc9c, #6cb1e6)',
          margin: '10px 0 30px 0',
        }}
      ></div>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>No tasks yet. Create your first task!</p>
      )}

      {tasks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <EditableTask
              key={task.id}
              task={{
                id: task.id,
                title: task.title,
                description: task.description || '',
                due_at: task.due_at,
                status: task.status,
              }}
              toggleTask={handleToggleTask}
              updateTask={updateTask}
              deleteTask={() => deleteTask(task.id)}
            />
          ))}
        </ul>
      )}

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function Tasks() {
  return (
    <TasksProvider>
      <TasksContent />
    </TasksProvider>
  );
}