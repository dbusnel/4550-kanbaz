"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface Todo {
  id: number;
  title: string;
}

interface TodosContextType {
  todos: Todo[];
  addTodo: (title: string) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, title: string) => void;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    setTodos([...todos, { id: Date.now(), title }]);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const updateTodo = (id: number, title: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  return (
    <TodosContext.Provider value={{ todos, addTodo, deleteTodo, updateTodo }}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);
  if (!context) throw new Error("useTodos must be inside TodosProvider");
  return context;
};
