import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Recurrence {
  NONE = 'none',
  TEN_SECONDS = '10_seconds',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface Todo {
  id: string;
  title: string;
  status: boolean;
  priority: Priority;
  recurrence: Recurrence;
  nextOccurrence: string;
  dependencies: Todo[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  priority?: Priority;
  recurrence?: Recurrence;
  dependencies?: string[];
}

export interface UpdateTodoDto {
  title?: string;
  status?: boolean;
  priority?: Priority;
  recurrence?: Recurrence;
  dependencies?: string[];
}

export const TodoAPI = {
  getAllTodos: async (sortBy?: string, priority?: Priority, status?: boolean): Promise<Todo[]> => {
    const params = new URLSearchParams();
    if (sortBy) params.append('sortBy', sortBy);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status.toString());

    const response = params ? await api.get(`/todos?${params.toString()}`) : await api.get(`/todos`);
    return response.data;
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoDto): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  updateTodo: async (id: string, updates: UpdateTodoDto): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    const response = await api.delete(`/todos/${id}`);
    if (response.status === 204) {
      return;
    }
    throw new Error(response.data?.error || 'Failed to delete todo');
  },
  
  searchTodos: async (query: string, sortBy?: string, priority?: Priority, status?: boolean): Promise<Todo[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (sortBy) params.append('sortBy', sortBy);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status.toString());

    const response = await api.get(`/todos/search?${params.toString()}`);
    return response.data;
  },
};

export default TodoAPI; 