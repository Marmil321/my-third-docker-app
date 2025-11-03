import {useEffect} from "react";
import TodaysTasksList from "../../components/todays-tasks-list/todays-tasks-list.component";
import UpcomingTasksList from "../../components/upcoming-tasks/upcoming-tasks.component";
import { useTasksContext } from "../../providers/tasks/tasks.context";
import { TasksProvider } from "../../providers/tasks/tasks.provider";
import type { Task } from "../../providers/tasks/tasks.types";

function HomeContent() {
  const { tasks, loading, error, fetchTasks, updateTask } = useTasksContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className={"container"}>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <TodaysTasksList 
        fetchedTasks={tasks as Task[]} 
        updateTask={updateTask} 
      />
      <UpcomingTasksList
        fetchedTasks={tasks as Task[]}
        updateTask={updateTask}
      />
    </div>
  );
}

export default function Home() {
  return (
    <TasksProvider>
      <HomeContent />
    </TasksProvider>
  );
}