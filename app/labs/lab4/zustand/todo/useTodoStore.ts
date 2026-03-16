import { create } from "zustand";

interface Todo {
  id: number;
  title: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (id: number, title: string) => void;
  deleteTodo: (id: number) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (title) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), title }],
    })),
  updateTodo: (id, title) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));