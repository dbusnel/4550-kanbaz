"use client";
import { ListGroupItem, FormControl, Button, ListGroup } from "react-bootstrap";
import { useTodoStore } from "./useTodoStore";
import { useState } from "react";

export default function ZustandTodoList() {
  const todosStore = useTodoStore();
  const [typedTitle, setTypedTitle] = useState("");
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null);
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
                todosStore.updateTodo(idToUpdate, typedTitle);
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
            onClick={() => todosStore.addTodo(typedTitle)}
            id="wd-add-todo-click"
            className="btn-success"
          >
            {" "}
            Add{" "}
          </Button>
        </div>
      </ListGroupItem>
      <div>
        {todosStore.todos.map((todo) => (
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
                onClick={() => todosStore.deleteTodo(todo.id)}
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
