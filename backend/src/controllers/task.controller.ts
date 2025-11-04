import { JsonController, Get, Post, Put, Delete, Param, Body, HttpCode, NotFoundError, BadRequestError } from 'routing-controllers';
import { tasksQueue } from '../queues/tasks.queue.js';
import { TaskRepository } from '../repositories/task.repository.js';

@JsonController('/task')
export class TaskController {
  @Get('s/')
  async getAllTasks() {
    const taskRepository = new TaskRepository();
    const response = await taskRepository.getAllTasks();
    console.log('Fetched tasks response:', response);
    return {
      success: response.success,
      data: response.tasks
    };
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: bigint) {
    const taskRepository = new TaskRepository();
    const response = await taskRepository.getTaskById(id);
    
    return {
      success: response.success,
      data: response.task
    };
  }

  @Post('/')
  @HttpCode(201)
  async createTask(@Body() body: { title: string; due_at: Date; description?: string }) {
    const { title, due_at, description } = body;

    if (!title) {
      throw new BadRequestError('Title is required');
    }
    if (!due_at) {
      throw new BadRequestError('Due date is required');
    }

    const job = await tasksQueue.add('create-task', {
      title,
      due_at,
      description: description || ''
    });
    console.log('Created job:', job.id);
    return {
      success: true,
      jobId: job.id
    };
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: bigint,
    @Body() body: { title?: string; description?: string; status?: string }
  ) {
    const job = await tasksQueue.add('update-task', {
      id,
      ...body
    });

    return {
      success: true,
      jobId: job.id
    };
  }

  @Delete('/:id')
  @HttpCode(202)
  async deleteTask(@Param('id') id: bigint) {
    const job = await tasksQueue.add('delete-task', { id });

    return {
      success: true,
      jobId: job.id
    };
  }
}
