import { Button } from "react-bootstrap";
import { MdDoNotDisturbAlt, MdNewReleases } from "react-icons/md";
import { FaCheckCircle, FaBell } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { CiEdit } from "react-icons/ci";
import { IoMdPersonAdd, IoIosStats, IoMdHelp } from "react-icons/io";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button
            variant="secondary"
            size="lg"
            className="w-100 text-nowrap d-flex flex-row"
          >
            <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish{" "}
          </Button>{" "}
        </div>
        <div className="w-50">
          <Button variant="success" size="lg" className="w-100 d-flex flex-row">
            <FaCheckCircle className="me-2 fs-5" /> Publish{" "}
          </Button>{" "}
        </div>
      </div>
      <br />
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <BiImport className="me-2 fs-5" /> Import Existing Content{" "}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons{" "}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <CiEdit className="me-2 fs-5" /> Edit enrolled students{" "}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <IoMdPersonAdd className="me-2 fs-5" /> Add instructors
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <IoIosStats className="me-2 fs-5" /> View analytics
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <MdNewReleases className="me-2 fs-5" /> View course updates
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <FaBell className="me-2 fs-5" /> View course notifications
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-100 mt-1 text-start d-flex flex-row"
      >
        <IoMdHelp className="me-2 fs-5" /> Help
      </Button>

      {/* Complete the rest of the buttons */}
    </div>
  );
}
