"use client";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import * as db from "../../../database";
import { BsGripVertical } from "react-icons/bs";
import { ModuleControlButtons } from "./LessonControlButtons";
import LessonControlButtons from "./LessonControlButtons";

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules;
  return (
    <ListGroup id="wd-modules" className="rounded-0, w-200">
      {modules
        .filter((module: any) => module.course === cid)
        .map((module: any, index: number) => (
          <ListGroupItem
            key={index}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary d-flex flex-row">
              <BsGripVertical className="me-2 fs-3" /> {module.name}{" "}
              <ModuleControlButtons />{" "}
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
