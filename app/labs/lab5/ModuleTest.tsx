"use client";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
import { useState } from "react";
import { FormControl } from "react-bootstrap";

type Module = {
  id: string;
  name: string;
  description: string;
  course: string;
};

export default function ModuleTest() {
  const [module, setModule] = useState<Module>({
    id: "34",
    name: "CS4730 Distributed Systems",
    description:
      "This module covers the fundamentals of distributed systems, including communication, synchronization, and fault tolerance.",
    course: "Computer Science",
  });

  //Test implementation of server module endpoint

  return (
    <div>
      <h2>Modules</h2>
      <a href={`${HTTP_SERVER}/lab5/module`} className="btn btn-primary">
        Get Module
      </a>
      <br />
      <br />
      <a href={`${HTTP_SERVER}/lab5/module/name`} className="btn btn-primary">
        Get Module name
      </a>
      <br />
      <br />
      <div className="flex flex-row items-center gap-2">
        <FormControl
          className="w-75"
          defaultValue={module.name}
          onChange={(e) => {
            setModule({ ...module, name: e.target.value });
          }}
        />
        <br />
        <a
          className="btn btn-primary"
          href={`${HTTP_SERVER}/lab5/module/name/${module.name}`}
        >
          Update Name{" "}
        </a>
      </div>
      <hr />
    </div>
  );
}
