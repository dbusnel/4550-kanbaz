import { useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { RootState } from "./store";
import { Provider, useSelector } from "react-redux";
export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>

      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
      <hr />
      <button className="btn btn-success" onClick={addElement}>
        Add Element
      </button>
      <ul>
        {array.map((item, index) => (
          <li key={index}>
            {" "}
            {item}
            <button
              className="btn btn-danger"
              onClick={() => deleteElement(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
