import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
export default function LessonControlButtons() {
  return (
    <div className="float-end d-flex flex-row ms-auto">
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

export function ModuleControlButtons() {
  return (
    <div className="float-end d-flex flex-row ms-auto">
      <GreenCheckmark />
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
