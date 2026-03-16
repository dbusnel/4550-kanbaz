"use client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import * as db from "../../../database";
import { BsGripVertical } from "react-icons/bs";
import { ModuleControlButtons } from "./LessonControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./modulesControls";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");

  return (
    <ListGroup id="wd-modules" className="rounded-0, w-200">
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }}
      />
      {modules
        .filter((module: any) => module.course === cid)
        .map((module: any, index: number) => (
          <ListGroupItem
            key={index}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary d-flex flex-row">
              <BsGripVertical className="me-2 fs-3" />{" "}
              <p className="flex-grow">{module.name}</p>{" "}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      dispatch(updateModule({ ...module, editing: false }));
                    }
                  }}
                  defaultValue={module.name}
                />
              )}
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => dispatch(deleteModule(moduleId))}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />{" "}
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any, lessonIndex: number) => (
                  <ListGroupItem
                    key={lessonIndex}
                    className="wd-lesson p-3 ps-1 d-flex flex-row"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />{" "}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
    </ListGroup>
  );
}

// import ModulesControls from "./modulesControls";
//
//
//
//

// export default function Modules() {
//   return (
//     <div>
//       <ModulesControls />
//       <br />
//       <br />
//       <br />
//       <br />

//       <ListGroup className="rounded-0" id="wd-modules">
//         <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//           <div className="wd-title p-3 ps-2 bg-secondary d-flex flex-row">
//             <BsGripVertical className="me-2 fs-3" />
//             Week 1 <ModuleControlButtons />
//           </div>
//           <ListGroup className="wd-lessons rounded-0">
//             <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row">
//               <BsGripVertical className="me-2 fs-3" />
//               LEARNING OBJECTIVES
//               <LessonControlButtons />
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row">
//               <BsGripVertical className="me-2 fs-3" />
//               Introduction to the course
//               <LessonControlButtons />
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row">
//               <BsGripVertical className="me-2 fs-3" />
//               Learn what is Web Development <LessonControlButtons />
//             </ListGroupItem>
//           </ListGroup>
//         </ListGroupItem>
//         <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//           <div className="wd-title p-3 ps-2 bg-secondary"> Week 2 </div>
//           <ListGroup className="wd-lessons rounded-0">
//             <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row">
//               <BsGripVertical className="me-2 fs-3" />
//               LESSON 1 <LessonControlButtons />
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1 d-flex flex-row">
//               <BsGripVertical className="me-2 fs-3" />
//               LESSON 2 <LessonControlButtons />
//             </ListGroupItem>
//           </ListGroup>
//         </ListGroupItem>
//       </ListGroup>
//     </div>
//   );
// }
