import {
  AiOutlineCalendar,
  AiOutlineDashboard,
  AiOutlineInbox,
  AiOutlineSetting,
} from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation">
      <ListGroup
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 "
        style={{ width: 120 }}
        id="wd-kambaz-navigation"
      >
        <ListGroupItem
          className="bg-black border-0 text-center d-flex justify-content-center"
          as="a"
          target="_blank"
          href="https://www.northeastern.edu/"
          id="wd-neu-link"
        >
          <img
            src="/images/NEU.png"
            width="75px"
            alt="Northeastern University"
          />
        </ListGroupItem>
        <br />
        <ListGroupItem className="border-0 bg-black text-center d-flex justify-content-center">
          <Link
            href="/account"
            id="wd-account-link"
            className="text-white text-decoration-none"
          >
            <FaRegCircleUser className="fs-1 text-white w-100" />
            <br />
            Account
          </Link>
        </ListGroupItem>
        <br />
        <ListGroupItem className="border-0 bg-white text-center d-flex justify-content-center">
          <Link
            href="/dashboard"
            id="wd-dashboard-link"
            className="text-danger text-decoration-none"
          >
            <AiOutlineDashboard className="fs-1 text-danger w-100" />
            <br />
            Dashboard
          </Link>
        </ListGroupItem>
        <br />
        <ListGroupItem className="border-0 bg-black text-center d-flex justify-content-center">
          <Link
            href="/calendar"
            id="wd-calendar-link"
            className="text-white text-decoration-none"
          >
            <AiOutlineCalendar className="fs-1 text-white w-100" />
            <br />
            Calendar
          </Link>
        </ListGroupItem>
        <br />
        <ListGroupItem className="border-0 bg-black text-center d-flex justify-content-center">
          <Link
            href="/inbox"
            id="wd-inbox-link"
            className="text-white text-decoration-none"
          >
            <AiOutlineInbox className="fs-1 text-white w-100" />
            <br />
            Inbox
          </Link>
        </ListGroupItem>
        <br />
        <ListGroupItem className="border-0 bg-black text-center d-flex justify-content-center">
          <Link
            href="/labs"
            id="wd-labs-link"
            className="text-white text-decoration-none"
          >
            <AiOutlineSetting className="fs-1 text-white w-100" />
            <br />
            Labs
          </Link>
        </ListGroupItem>
        <br />
        <br />
        {/* complete styling the rest of the links */}
      </ListGroup>
      {/* <a href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank">
        Northeastern
      </a>
      <br />
      <Link href="/account" id="wd-account-link">
        Account
      </Link>
      <br />
      <Link href="/dashboard" id="wd-dashboard-link">
        Dashboard
      </Link>
      <br />
      <Link href="/dashboard" id="wd-course-link">
        Courses
      </Link>
      <br />
      <Link href="/calendar" id="wd-calendar-link">
        Calendar
      </Link>
      <br />
      <Link href="/inbox" id="wd-inbox-link">
        Inbox
      </Link>
      <br />
      <Link href="/labs" id="wd-labs-link">
        Labs
      </Link>
      <br /> */}
    </div>
  );
}
