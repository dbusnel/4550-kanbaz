"use client";
import { ListGroup, ListGroupItem, FormControl, Button } from "react-bootstrap";
import { useTodoStore } from "./useTodoStore";
import { useState } from "react";

export default function ZustandTodoList() {
  const [typedTitle, setTypedTitle] = useState("");
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null);

  const { todos, addTodo, updateTodo, deleteTodo } = useTodoStore(
    (state) => state,
  );

  return (
    <ListGroup>
      <ListGroupItem>
        <div className="flex flex-row">
          <FormControl
            value={typedTitle}
            onChange={(e) => setTypedTitle(e.target.value)}
          />
          <Button
            onClick={() => {
              if (idToUpdate !== null) {
                updateTodo(idToUpdate, typedTitle);
                setIdToUpdate(null);
              }
            }}
            id="wd-update-todo-click"
            className="btn-warning"
          >
            {" "}
            Update{" "}
          </Button>
          <Button
            onClick={() => addTodo(typedTitle)}
            id="wd-add-todo-click"
            className="btn-success"
          >
            {" "}
            Add{" "}
          </Button>
        </div>
      </ListGroupItem>
      <div>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <div className="flex flex-row">
              <p className="flex-grow">{todo.title}</p>
              <Button
                onClick={() => setIdToUpdate(todo.id)}
                id="wd-set-todo-click"
              >
                {" "}
                Edit{" "}
              </Button>
              <Button
                onClick={() => deleteTodo(todo.id)}
                id="wd-delete-todo-click"
                className="btn-danger"
              >
                {" "}
                Delete{" "}
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </div>
    </ListGroup>
  );
}
