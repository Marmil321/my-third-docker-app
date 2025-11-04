import type {Job} from 'bullmq';
import {Task} from "../types/task.type";
import { TaskRepository } from '../repositories/task.repository';

export default async function taskJob(job: Job<Task>) {
  const {name, data} = job;

  switch (name) {
    case 'create-task':
      return await handleCreateTask(job, data);
    case 'update-task':
      return await handleUpdateTask(job, data);
    case 'delete-task':
      return await handleDeleteTask(job, data);

    default:
      throw new Error(`Unknown job type: ${name}`);
  }
}

async function handleCreateTask(job: Job, data: Task) {
  await job.updateProgress(10);
  const taskRepository = new TaskRepository();
  const result = await taskRepository.createTask(data);

  await job.updateProgress(100);

  return {
    success: true,
    task: result.task
  };
}

async function handleUpdateTask(job: Job, data: Task) {
  await job.updateProgress(10);
  const taskRepository = new TaskRepository();
  const result = await taskRepository.updateTask(data);
  
  await job.updateProgress(100);

  return {
    success: true,
    task: result.task
  };
}

async function handleDeleteTask(job: Job, data: any) {
  await job.updateProgress(10);
  const taskRepository = new TaskRepository();
  await taskRepository.deleteTask(data.id);
  

  await job.updateProgress(100);

  return {
    success: true,
    taskId: data.id
  };
}
