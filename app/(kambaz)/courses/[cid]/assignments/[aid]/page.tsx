//import { redirect } from "next/dist/server/api-utils";

import {
  Form,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  InputGroup,
  Row,
  Col,
  Button,
} from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="assignment-editor" className="w-50">
      <FormLabel>Assignment name:</FormLabel>
      <FormControl type="text" />
      <br />
      <FormControl as="textarea" rows={5} />
      <br />
      <Row>
        <FormLabel column sm={2}>
          {" "}
          Points{" "}
        </FormLabel>
        <Col sm={10}>
          <FormControl type="text" defaultValue="100" />
        </Col>
      </Row>
      <br />
      <Row>
        <FormLabel column sm={2}>
          {" "}
          Assignment Group{" "}
        </FormLabel>
        <Col sm={10}>
          <FormSelect>
            <option value="0" defaultChecked>
              ASSIGNMENTS
            </option>
            <option value="1">Group1</option>
            <option value="2">Group2</option>
            <option value="3">Group3</option>
          </FormSelect>
        </Col>
      </Row>
      <Row>
        <FormLabel column sm={2}>
          {" "}
          Display grade as{" "}
        </FormLabel>
        <Col sm={10}>
          <FormSelect>
            <option value="percentage" defaultChecked>
              Percentage
            </option>
            <option value="points">Points</option>
          </FormSelect>
        </Col>
      </Row>
      <Row>
        <FormLabel column sm={2}>
          {" "}
          Submission type:{" "}
        </FormLabel>
        <Col sm={10}>
          <div className="outline outline-1 outline-black p-3">
            <FormSelect className="p-3">
              <option value="0" defaultChecked>
                Online
              </option>
              <option value="1">Option1</option>
            </FormSelect>
            <br />
            <p className="font-bold">Online entry options</p>
            <FormCheck defaultChecked={true} label="Text entry" />
            <br />
            <FormCheck defaultChecked={false} label="Website URL" />
            <br />
            <FormCheck defaultChecked={false} label="Media Recordings" />
            <br />
            <FormCheck defaultChecked={false} label="Student Annotation" />
            <br />
            <FormCheck defaultChecked={false} label="File Uploads" />
            <br />
          </div>
        </Col>
      </Row>
    </div>
  );
}

//     <div id="wd-assignments-editor">
//       <label htmlFor="wd-name">Assignment Name</label>
//       <input id="wd-name" defaultValue="A1 - ENV + HTML" />
//       <br />
//       <br />
//       <textarea
//         id="wd-description"
//         defaultValue={
//           "The assignment is available online Submit a link to the landing page of"
//         }
//       ></textarea>
//       <br />
//       <table>
//         <tbody>
//           <tr>
//             <td align="right" valign="top">
//               <label htmlFor="wd-points">Points</label>
//             </td>
//             <td>
//               <input id="wd-points" defaultValue={100} />
//             </td>
//           </tr>
//           <tr>
//             <td align="right" valign="top">
//               <label htmlFor="wd-group">Assignment Group</label>
//             </td>
//             <td>
//               <select id="wd-group" defaultValue={"assignments"}>
//                 <option id="assignments">ASSIGNMENTS</option>
//               </select>
//             </td>
//           </tr>
//           <tr>
//             <td align="right" valign="top">
//               <label htmlFor="wd-grade-display">Display Grade as</label>
//             </td>
//             <td>
//               <select id="wd-grade-display" defaultValue={"assignments"}>
//                 <option id="percentage">Percentage</option>
//                 <option id="points">Points</option> {/*I'm guessing here lol*/}
//               </select>
//             </td>
//           </tr>
//           <tr>
//             <td align="right" valign="top">
//               <label htmlFor="wd-submission-type">Submission Type</label>
//             </td>
//             <td>
//               <select id="wd-submission-type" defaultValue={"online"}>
//                 <option id="online">Online</option>
//                 <option id="in-person">In person</option>
//               </select>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <p>Online Entry Options</p>
//               <input type="checkbox" name="text-entry" id="check-text-entry" />
//               <label htmlFor="check-text-entry">Text Entry</label>
//               <br />
//               <input type="checkbox" name="url-entry" id="check-url-entry" />
//               <label htmlFor="check-url-entry">Website URL</label>
//               <br />
//               <input
//                 type="checkbox"
//                 name="media-entry"
//                 id="check-media-entry"
//               />
//               <label htmlFor="check-media-entry">Media Recordings</label>
//               <br />
//               <input
//                 type="checkbox"
//                 name="annotation-entry"
//                 id="check-annotation-entry"
//               />
//               <label htmlFor="check-annotation-entry">Student Annotation</label>
//               <br />
//               <input type="checkbox" name="file-entry" id="check-file-entry" />
//               <label htmlFor="check-file-entry">File Upload</label>
//               <br />
//               <br />
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <label htmlFor="assignment-entry">Assign Assign to</label>
//               <br />
//               <input id="assignment-entry" defaultValue={"Everyone"}></input>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <br />
//               <label htmlFor="due-date-entry">Due</label>
//               <br />
//               <input
//                 defaultValue={"2026-01-26g"}
//                 type="date"
//                 id="due-date-entry"
//               ></input>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <br />
//               <label htmlFor="available-from-date-entry">Available from</label>
//               <br />
//               <input
//                 defaultValue={"2026-01-20"}
//                 type="date"
//                 id="available-from-date-entry"
//               ></input>
//             </td>
//             <td>
//               <br />
//               <label htmlFor="available-until-date-entry">Until</label>
//               <br />
//               <input
//                 type="date"
//                 id="available-until-date-entry"
//                 defaultValue={"2026-01-27"}
//               ></input>
//             </td>
//           </tr>
//           <tr>
//             <td />
//             <td>
//               <br />
//               <button id="button-cancel">Cancel</button>
//               <button id="button-save">Save</button>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }
