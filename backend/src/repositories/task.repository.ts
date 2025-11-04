import { postgres } from "../postgres.js";

export class TaskRepository {
    async getAllTasks() {
        try {
        const result = await postgres.query(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );

        return {
            success: true,
            tasks: result.rows,
        };
        } catch (error) {
        console.error('Error fetching tasks:', error);
        return {
            success: false,
            message: 'Failed to fetch tasks',
        };
        }
    }

    async getTaskById(id: bigint) {
    try {
        const result = await postgres.query(
        'SELECT * FROM tasks WHERE id = $1',
        [id]
        );

        if (result.rows.length === 0) {
        return {
            success: false,
            message: `Task with ID ${id} not found`,
        };
        }

        return {
        success: true,
        task: result.rows[0],
        };
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        return {
        success: false,
        message: 'Failed to fetch task',
        error: error instanceof Error ? error.message : String(error),
        };
    }
}
}