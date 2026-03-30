"use client";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
import { useState } from "react";
import { FormControl } from "react-bootstrap";

type Assignment = {
  id: string;
  name: string;
  description: string;
  completed: string;
  score: number;
};

export default function AssignmentTest() {
  const [assignment, setAssignment] = useState<Assignment>({
    id: "1",
    name: "Paxos Protocol",
    description:
      "Implement the Paxos consensus algorithm in a distributed system.",
    completed: "false",
    score: 0,
  });

  //Test implementation of server module endpoint

  return (
    <div>
      <h2>Assignments</h2>
      <a
        href={`${HTTP_SERVER}/lab5/module/assignment`}
        className="btn btn-primary"
      >
        Get Assignment
      </a>
      <hr />
      <div className="flex flex-row items-center gap-2">
        <p>Score: </p>
        <FormControl
          className="w-75"
          id="wd-assignment-title"
          defaultValue={assignment.score}
          onChange={(e) => {
            setAssignment({ ...assignment, score: Number(e.target.value) });
          }}
        />
        <a
          className="btn btn-primary"
          href={`${HTTP_SERVER}/lab5/module/assignment/score/${assignment.score}`}
        >
          Update Score{" "}
        </a>
      </div>
      <br />
      <div className="flex flex-row items-center gap-2">
        <label htmlFor="wd-assignment-complete" className="form-label">
          Completed?
        </label>
        <input
          type="checkbox"
          checked={assignment.completed === "true"}
          className="w-75"
          id="wd-assignment-complete"
          defaultValue={assignment.completed ? "true" : "false"}
          onChange={(e) => {
            setAssignment({
              ...assignment,
              completed: e.target.checked ? "true" : "false",
            });
          }}
        />
        <a
          className="btn btn-primary"
          href={`${HTTP_SERVER}/lab5/module/assignment/completed/${assignment.completed === "true" ? "true" : "false"}`}
        >
          Update{" "}
        </a>
      </div>
      <br />
      <hr />
    </div>
  );
}
