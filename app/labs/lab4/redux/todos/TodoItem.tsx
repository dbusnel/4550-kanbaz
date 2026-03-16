import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id}>
      <div className="flex flex-row">
        <p className="flex-grow">{todo.title}</p>
        <Button onClick={() => dispatch(setTodo(todo))} id="wd-set-todo-click">
          {" "}
          Edit{" "}
        </Button>
        <Button
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
          className="btn-danger"
        >
          {" "}
          Delete{" "}
        </Button>
      </div>
    </ListGroupItem>
  );
}
