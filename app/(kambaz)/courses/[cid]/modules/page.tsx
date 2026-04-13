"use client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import * as db from "../../../database";
import { BsGripVertical } from "react-icons/bs";
import { ModuleControlButtons } from "./LessonControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./modulesControls";
import * as client from "../../client";
import {
  addModule,
  editModule,
  updateModule,
  deleteModule,
  setModules,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();
  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const moduleCreated = await client.createModuleForCourse(
      cid as string,
      newModule,
    );
    dispatch(setModules([...modules, moduleCreated]));
  };

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const [moduleName, setModuleName] = useState("");

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(cid as string, moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

  const onUpdateModule = async (module: any) => {
    await client.updateModule(cid as string, module);
    const newModules = modules.map((m: any) =>
      m._id === module._id ? module : m,
    );
    dispatch(setModules(newModules));
  };

  return (
    <ListGroup id="wd-modules" className="rounded-0, w-200">
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={onCreateModuleForCourse}
      />
      {modules.map((module: any, index: number) => (
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
                    onUpdateModule({ ...module, editing: false });
                  }
                }}
                defaultValue={module.name}
              />
            )}
            <ModuleControlButtons
              moduleId={module._id}
              deleteModule={(moduleId) => onRemoveModule(moduleId)}
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
