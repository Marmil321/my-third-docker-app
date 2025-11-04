import { postgres } from "../postgres.js";
import type { Task } from "../types/task.type.js";

export class TaskRepository {
  async createTask(data: Task) {
    const result = await postgres.query(
      `INSERT INTO tasks (title, due_at, description, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [data.title, data.due_at, data.description || '', 'todo']
    );
    return {
      success: true,
      task: result.rows[0]
    };
  }  

  async updateTask(data: Task) {
    const { id } = data;
    
    if (!id) {
        throw new Error('Task ID is required');
    }

    const ALLOWED_COLUMNS = ['title', 'description', 'status', 'due_at'] as const;
    
    const updates: string[] = [];
    const values: (string | bigint | Date | null)[] = [];
    let paramCount = 1;

    for (const column of ALLOWED_COLUMNS) {
        const value = data[column];
        if (value !== undefined) {
            updates.push(`${column} = $${paramCount++}`);
            values.push(value);
        }
    }

    if (updates.length === 0) {
        throw new Error('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
        UPDATE tasks
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
    `;

    const result = await postgres.query(query, values);

    if (result.rows.length === 0) {
        throw new Error(`Task with id ${id} not found`);
    }

    return {
        success: true,
        task: result.rows[0]
    };
  }  
  
  async deleteTask(id: bigint) {
    const result = await postgres.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found');
  }

  return {
    success: true,
    taskId: result.rows[0].id
  };
}  

}