import type {Job} from 'bullmq';
import {Task} from "../types/task.type";
import {postgres} from '../postgres';

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

  const {title, description} = data;

  const result = await postgres.query(
    `INSERT INTO tasks (title, due_at, description, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, data.due_at, description || '', 'todo']
  );

  await job.updateProgress(100);

  return {
    success: true,
    task: result.rows[0]
  };
}

async function handleUpdateTask(job: Job, data: Task) {
  await job.updateProgress(10);

  const {id, title, description, status} = data;

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramCount++}`);
    values.push(title);
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (status !== undefined) {
    updates.push(`status = $${paramCount++}`);
    values.push(status);
  }
  if( data.due_at !== undefined) {
    updates.push(`due_at = $${paramCount++}`);
    values.push(data.due_at);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  await job.updateProgress(50);

  const result = await postgres.query(
    `UPDATE tasks
     SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found');
  }

  await job.updateProgress(100);

  return {
    success: true,
    task: result.rows[0]
  };
}

async function handleDeleteTask(job: Job, data: any) {
  await job.updateProgress(10);

  const {id} = data;

  const result = await postgres.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found');
  }

  await job.updateProgress(100);

  return {
    success: true,
    taskId: result.rows[0].id
  };
}
