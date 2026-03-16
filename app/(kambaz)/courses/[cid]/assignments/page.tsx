"use client";
import {
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Link from "next/link";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { ModuleControlButtons } from "../modules/LessonControlButtons";
import LessonControlButtons from "../modules/LessonControlButtons";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { LuNotepadText } from "react-icons/lu";
import { BsGripVertical } from "react-icons/bs";
import { assignments } from "@/app/(kambaz)/database";
import { redirect, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addAssignment,
  editAssignment,
  updateAssignment,
  deleteAssignment,
} from "./reducer";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../../store";
import { FaTrashAlt } from "react-icons/fa";

function isAssignmentAvailable(assignment: any) {
  const now = new Date();
  const availableDate = new Date(assignment.availableDate);
  return now >= availableDate;
}

export default function Assignments() {
  const { cid } = useParams();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentReducer,
  );
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column">
      <span className="d-flex flex-row">
        <div className="flex-grow pr-4 pt-4">
          <InputGroup className="mb-3">
            <InputGroupText>
              <IoIosSearch />
            </InputGroupText>
            <FormControl placeholder="Search..."></FormControl>
          </InputGroup>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="me-1 float-end d-flex flex-row items-center"
          id="wd-add-group-btn"
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Group
        </Button>
        <Button
          variant="danger"
          size="lg"
          onClick={() => {
            // Make a new assignment then naviagate to its edit page
            // Note: I'm 99% this works but the redirect back to the assignments page repopulates the form with database info (i assume we'll eventually add on to this to add the new assignment to the database!)
            const newAssignment = {
              name: "New Assignment",
              course: cid,
              id: uuidv4(),
            };
            dispatch(addAssignment(newAssignment));
            console.log(assignments);

            redirect(`/courses/${cid}/assignments/${newAssignment.id}`);
          }}
          className="me-1 float-end d-flex flex-row items-center"
          id="wd-add-assignment-btn"
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Assignment
        </Button>
      </span>
      <br />
      <br />
      <br />
      <div className="d-flex flex-row">
        <ListGroup className="rounded-0 flex-grow pr-16 w-250" id="wd-modules">
          <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex flex-row">
              Week 1 <ModuleControlButtons />
            </div>
            <ListGroup className="wd-lessons rounded-0">
              {assignments
                .filter((assignment: any) => assignment.course === cid)
                .map((assignment: any, index: number) => (
                  <ListGroupItem
                    key={assignment._id}
                    className="wd-lesson p-3 ps-1 d-flex flex-row items-center"
                  >
                    <div className="d-flex flex-row items-center">
                      <BsGripVertical className="me-2 fs-3" />
                      <LuNotepadText size={36} className="pr-2" />
                      <div>
                        <Link
                          href={`/courses/${assignment.course}/assignments/${assignment._id}`}
                          className="font-bold m-0 text-black"
                        >
                          {assignment.name}
                        </Link>
                        <span className="d-flex flex-row m-0 p-0 items-center">
                          <p className="text-danger pr-2 m-0">
                            {assignment.module || "Multiple modules"}
                          </p>{" "}
                          |
                          <p className="font-bold pl-2 m-0">
                            {isAssignmentAvailable(assignment)
                              ? "Available:"
                              : "Not available until:"}{" "}
                          </p>
                          <p className="pl-2 m-0">{assignment.availableDate}</p>
                        </span>
                        <span className="d-flex flex-row m-0 p-0 items-center">
                          <p className="font-black m-0">Due</p>
                          <p className="pl-2 pr-2 m-0">
                            {`${assignment.dueDate} at ${assignment.dueTime}`}{" "}
                          </p>{" "}
                          |<p className="pl-2 m-0">{assignment.points} pts </p>
                        </span>
                      </div>
                    </div>
                    <LessonControlButtons />
                    <FaTrashAlt
                      onClick={() => dispatch(deleteAssignment(assignment._id))}
                    />
                  </ListGroupItem>
                ))}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
}

// Old implementation
/* <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row items-center">
                <div className="d-flex flex-row items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <LuNotepadText size={36} className="pr-2" />
                  <div>
                    <Link
                      href="/courses/1234/assignments/123"
                      className="font-bold m-0 text-black"
                    >
                      Assignment 2
                    </Link>
                    <span className="d-flex flex-row m-0 p-0 items-center">
                      <p className="text-danger pr-2 m-0">Multiple Modules</p> |
                      <p className="font-bold pl-2 m-0">
                        Not available until:{" "}
                      </p>
                      <p className="pl-2 m-0">May 16th at 12:00 AM </p>
                    </span>
                    <span className="d-flex flex-row m-0 p-0 items-center">
                      <p className="font-black m-0">Due</p>
                      <p className="pl-2 pr-2 m-0">July 28th at 11:59 PM </p> |
                      <p className="pl-2 m-0">400 pts </p>
                    </span>
                  </div>
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row items-center">
                <div className="d-flex flex-row items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <LuNotepadText size={36} className="pr-2" />
                  <div>
                    <Link
                      href="/courses/1234/assignments/123"
                      className="font-bold m-0 text-black"
                    >
                      Final
                    </Link>
                    <span className="d-flex flex-row m-0 p-0 items-center">
                      <p className="text-danger pr-2 m-0">Multiple Modules</p> |
                      <p className="font-bold pl-2 m-0">
                        Not available until:{" "}
                      </p>
                      <p className="pl-2 m-0">August 1st at 12:00 AM </p>
                    </span>
                    <span className="d-flex flex-row m-0 p-0 items-center">
                      <p className="font-black m-0">Due</p>
                      <p className="pl-2 pr-2 m-0">
                        December 31st at 11:59 PM{" "}
                      </p>{" "}
                      |<p className="pl-2 m-0">1200 pts </p>
                    </span>
                  </div>
                </div>
                <LessonControlButtons />
              </ListGroupItem> */
