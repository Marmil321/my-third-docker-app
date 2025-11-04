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

