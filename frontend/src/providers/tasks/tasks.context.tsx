import React, { createContext } from 'react';
import type { TasksContextValue } from './tasks.types';

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function useTasksContext() {
  const ctx = React.useContext(TasksContext);
    if (!ctx) {
    throw new Error('useTasksContext must be used within <TasksProvider>');
    }

    return ctx;
}