import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { MdOutlineEditCalendar } from "react-icons/md";
import { Button } from "react-bootstrap";

export default function Profile() {
  return (
    <div className="p-4 flex flex-column" id="wd-profile-screen">
      <h1>Profile</h1>
      <div className="p-2">
        <FormControl className="mb-2" placeholder="alice" />
        <FormControl className="mb-2" placeholder="123" />
        <FormControl className="mb-2" placeholder="Alice" />
        <FormControl className="mb-2" placeholder="Wonderland" />
        <InputGroup className="mb-2">
          <FormControl type="text m-0 p-2" placeholder="mm/dd/yyyy" />
          <InputGroupText>
            <MdOutlineEditCalendar />
          </InputGroupText>
        </InputGroup>
        <FormControl className="mb-2" placeholder="alice@wonderland.com" />
        <FormControl className="mb-2" placeholder="User" />
      </div>
      <Button
        variant="danger"
        size="lg"
        className="me-1 flex-grow items-center"
        id="wd-add-assignment-btn"
      >
        Sign out
      </Button>
    </div>
  );
}
