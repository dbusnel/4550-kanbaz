import ZustandCounter from "./counter";
import ZustandTodoList from "./todo/zustandTodoList";
export default function ZustandExamples() {
  return (
    <div>
      <h2>Zustand Examples</h2>
      <ZustandCounter />
      <h2>To-Do List</h2>
      <ZustandTodoList />
    </div>
  );
}
