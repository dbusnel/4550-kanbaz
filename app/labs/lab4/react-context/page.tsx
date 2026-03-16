"use client";

import CounterContext from "./counter";
import { CounterProvider } from "./counter/context";
import ReactContextTodoList from "./todolist/ReactContextTodoList";
import { TodosProvider } from "./todolist/todosContext";

export default function ReactContextExamples() {
  return (
    <div>
      <h1>React Context Examples</h1>
      <CounterProvider>
        <CounterContext />
      </CounterProvider>
      <h2>To-Do List</h2>
      <TodosProvider>
        <ReactContextTodoList />
      </TodosProvider>
    </div>
  );
}
