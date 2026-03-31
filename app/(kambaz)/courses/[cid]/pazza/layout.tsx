"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { MdOutlineForum } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import "./style.css";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import { useState, useEffect } from "react";
import { userInfo } from "os";

interface userInfo {
  firstName: string;
  lastName: string;
  _id: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  logistics: "primary",
  homework: "warning",
  announcements: "danger",
  general: "secondary",
};

export default function PazzaLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const pathname = usePathname();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const [posts, setPosts] = useState([]);

  const nameInfo: userInfo = { firstName: "", lastName: "", _id: "" };
  if (
    currentUser !== null &&
    "firstName" in currentUser &&
    "lastName" in currentUser &&
    "_id" in currentUser
  ) {
    const user = currentUser as {
      firstName: string;
      lastName: string;
      _id: string;
    };
    nameInfo.firstName = user.firstName;
    nameInfo.lastName = user.lastName;
    nameInfo._id = user._id;
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (nameInfo === null || cid === undefined) return [];
      const posts = await client.getAllPazzaPosts(cid as string, nameInfo._id);
      setPosts(posts);
    };
    fetchPosts();
  }, [currentUser, cid, nameInfo]);

  if (currentUser === null || cid === undefined)
    return (
      <div>
        <p>Please log in.</p>
      </div>
    );

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
      {/* Top navbar */}
      <Nav variant="pills" style={{ backgroundColor: "#70b9e0" }}>
        {/* <div
        className="d-flex align-items-center gap-2 px-3 py-2 border-bottom bg-white margin-auto"
        style={{ flexShrink: 0 }}
      > */}
        <div
          className="d-flex align-items-center gap-1 pl-5"
          style={{ width: "10vw" }}
        >
          <MdOutlineForum className="link-unselected" />
          <p className="mb-0 link-unselected">pazza</p>
        </div>

        <div className="d-flex align-items-center gap-1 link-unselected">
          {cid}
        </div>

        <div className="w-40"></div>
        <NavItem>
          <NavLink
            href={`/courses/${cid}/pazza`}
            className={`nav-link ${pathname.endsWith("pazza") ? "active" : ""}`}
          >
            Q & A
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            href={`/courses/${cid}/pazza/manage`}
            className={`nav-link ${pathname.endsWith("manage") ? "active" : ""}`}
          >
            Manage class
          </NavLink>
        </NavItem>

        <div className="ms-auto d-flex gap-2">
          <FaCircleUser />
          <p>{`${currentUser.firstName} ${currentUser.lastName}`}</p>
        </div>
        {/* </div> */}
      </Nav>

      {/* Filter bar */}
      <div
        className="d-flex align-items-center gap-2 px-3 py-1 border-bottom bg-light"
        style={{ flexShrink: 0, fontSize: 13 }}
      >
        <span className="text-muted me-1">Filter:</span>
        {["All", "Unread", "Unanswered", "Following"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm py-0 ${f === "All" ? "btn-secondary" : "btn-outline-secondary"}`}
            style={{ fontSize: 12 }}
          >
            {f}
          </button>
        ))}
        <div className="vr mx-1" />
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <button
            key={cat}
            className={`btn btn-sm btn-outline-${color} py-0`}
            style={{ fontSize: 12 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Body: sidebar + content */}
      <div
        className="d-flex flex-grow-1"
        style={{ minHeight: 0, overflow: "hidden" }}
      >
        {/* Posts sidebar */}
        <div
          className="border-end bg-white overflow-auto"
          style={{ width: 280, flexShrink: 0 }}
        >
          <div className="list-group list-group-flush">
            {posts.map((post) => {
              const href = `/courses/${cid}/pazza/${post.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={post.id}
                  href={href}
                  className={`list-group-item list-group-item-action border-0 border-bottom px-3 py-2 ${active ? "active" : ""}`}
                  style={{ fontSize: 14 }}
                >
                  <div className="d-flex align-items-start gap-2">
                    {post.unread && !active && (
                      <span
                        className="bg-primary rounded-circle mt-1"
                        style={{ width: 8, height: 8, flexShrink: 0 }}
                      />
                    )}
                    {(!post.unread || active) && (
                      <span style={{ width: 8, flexShrink: 0 }} />
                    )}
                    <div className="flex-grow-1 overflow-hidden">
                      <div
                        className={`text-truncate ${post.unread && !active ? "fw-semibold" : ""}`}
                      >
                        {post.summary}
                      </div>
                      <div className="d-flex align-items-center gap-1 mt-1">
                        <span
                          className={`badge text-bg-${CATEGORY_COLORS[post.type] ?? "secondary"}`}
                          style={{ fontSize: 10 }}
                        >
                          {post.type}
                        </span>
                        {post.answered && (
                          <span
                            className="badge text-bg-success"
                            style={{ fontSize: 10 }}
                          >
                            answered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
