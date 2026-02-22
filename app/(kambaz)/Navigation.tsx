"use client";
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
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/dashboard", icon: AiOutlineDashboard },
    { label: "Courses", path: "/dashboard", icon: LiaBookSolid },
    { label: "Calendar", path: "/Calendar", icon: IoCalendarOutline },
    { label: "Inbox", path: "/Inbox", icon: FaInbox },
    { label: "Labs", path: "/labs", icon: LiaCogSolid },
  ];

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
        <ListGroupItem
          as={Link}
          href="/account"
          className={`text-center border-0 bg-black d-flex justify-content-center flex-column text-center
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}
        >
          <div className="d-flex flex-grow justify-content-center">
            <FaRegCircleUser
              className={`fs-1 ${pathname.includes("account") ? "text-danger" : "text-white"}`}
            />
          </div>
          <br />
          Account
        </ListGroupItem>
        {links.map((link, index) => (
          <ListGroupItem
            key={index}
            as={Link}
            href={link.path}
            className={`bg-black text-center border-0 d-flex justify-content-center flex-column text-center
            ${pathname.includes(link.label.toLowerCase()) ? "text-danger bg-white" : "text-white bg-black"}`}
          >
            {
              <div className="d-flex flex-grow justify-content-center">
                {link.icon({ className: "fs-1 text-danger" })}
              </div>
            }
            <br />
            {link.label}
          </ListGroupItem>
        ))}
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
