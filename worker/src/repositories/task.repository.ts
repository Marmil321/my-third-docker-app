import { postgres } from "../postgres.js";
import type { Task} from "../types/task.type.js";

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