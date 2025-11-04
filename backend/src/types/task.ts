function isValidDate(date: any): date is Date {
    if (!date) return true;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

function hasDate(date: any): date is Date {
    return date !== undefined && date !== null;
}

function hasTitle(title: any): title is string {
    return typeof title === 'string' && title.trim().length > 0;
}

export type Task = {
    id: bigint;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';

    due_at?: Date;
    completed_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export type CreateTaskDTO = {
    title: string;
    description?: string;
    due_at?: Date;
}

export type UpdateTaskDTO = {
    title?: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'done';
    due_at?: Date;
}

export function validateCreateTaskDTO(data: any): CreateTaskDTO {
    if (!hasTitle(data.title)) {
        throw new Error('Title is required and must be a non-empty string');
    }
    if (hasDate(data.due_at) && !isValidDate(data.due_at)) {
        throw new Error('Invalid date');
    }
    if (!isValidDate(data.due_at)) {
        throw new Error('Due date is required');
    }
    return data as CreateTaskDTO;
}

export function validateUpdateTaskDTO(data: any): UpdateTaskDTO {
    if (data.due_at && !isValidDate(data.due_at)) {
        throw new Error('Invalid date');
    }
    return data as UpdateTaskDTO;
}
