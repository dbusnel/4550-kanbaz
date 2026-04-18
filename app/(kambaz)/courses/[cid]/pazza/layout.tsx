"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
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
import DOMPurify from "dompurify";

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
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const [posts, setPosts] = useState([]);
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolders, setActiveFolders] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];
  const isInstructor = INSTRUCTOR_ROLES.includes(
    (currentUser as any)?.role?.toUpperCase(),
  );
  const isManagePage = pathname.endsWith("/manage");
  const showSidebar = sidebarVisible && !isManagePage;

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
  }, [currentUser, cid, pathname]);

  useEffect(() => {
    if (!cid) return;
    client.getPazzaFolders(cid as string).then(setFolders);
  }, [cid]);

  const toggleFolderFilter = (folderId: string) => {
    setActiveFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId],
    );
  };

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

        {isInstructor && (
          <NavItem>
            <NavLink
              href={`/courses/${cid}/pazza/manage`}
              className={`nav-link ${pathname.endsWith("manage") ? "active" : ""}`}
            >
              Manage class
            </NavLink>
          </NavItem>
        )}

        <div className="ms-auto d-flex gap-2">
          <FaCircleUser />
          <p>{`${currentUser.firstName} ${currentUser.lastName}`}</p>
        </div>
        {/* </div> */}
      </Nav>

      {/* Filter bar */}
      {!isManagePage && <div
        className="d-flex align-items-center gap-2 px-3 py-1 border-bottom bg-light"
        style={{ flexShrink: 0, fontSize: 13 }}
      >
        <button
          className="btn btn-sm btn-link p-0 text-secondary"
          onClick={() => setSidebarVisible((v) => !v)}
          title={sidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarVisible ? <GoTriangleLeft size={16} /> : <GoTriangleRight size={16} />}
        </button>
        <button
          className="btn btn-sm btn-outline-secondary py-0"
          style={{ fontSize: 12 }}
          onClick={() => setActiveFolders([])}
        >
          Clear
        </button>
        <div className="vr mx-1" />
        <span className="text-muted me-1">Filter:</span>
        {folders.map((folder) => {
          const color = CATEGORY_COLORS[folder.name.toLowerCase()] ?? "secondary";
          const active = activeFolders.includes(folder.id);
          return (
            <button
              key={folder.id}
              className={`btn btn-sm py-0 ${active ? `btn-${color}` : `btn-outline-${color}`}`}
              style={{ fontSize: 12 }}
              onClick={() => toggleFolderFilter(folder.id)}
            >
              {folder.name}
            </button>
          );
        })}
      </div>}

      {/* Body: sidebar + content */}
      <div
        className="d-flex flex-grow-1"
        style={{ minHeight: 0, overflow: "hidden" }}
      >
        {/* Posts sidebar */}
        <div
          className="border-end bg-white overflow-auto"
          style={{
            width: showSidebar ? 280 : 0,
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          <div style={{ width: 280 }}>
          <div className="p-2 border-bottom d-flex gap-2 align-items-center">
            <button
              className="btn btn-primary"
              style={{ fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }}
              onClick={() => router.push(`/courses/${cid}/pazza/new`)}
            >
              <FaPlus className="me-1" style={{ fontSize: 11 }} />
              New Post
            </button>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch style={{ fontSize: 11, color: "#6c757d" }} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: 13 }}
              />
            </div>
          </div>
          <div className="list-group list-group-flush">
            {[...posts]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .filter((post) => {
                if (activeFolders.length > 0 && !activeFolders.some((id) => post.folderIds?.includes(id))) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  if (!post.summary?.toLowerCase().includes(q) && !post.details?.toLowerCase().includes(q)) return false;
                }
                return true;
              })
              .map((post) => {
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
                        className="fw-bold text-truncate"
                        style={{ color: active ? undefined : "#000" }}
                      >
                        {post.summary}
                      </div>
                      {post.details && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.details),
                          }}
                          style={{
                            fontSize: 12,
                            color: active ? undefined : "#6c757d",
                            marginTop: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: "1.4",
                          }}
                        />
                      )}
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
        </div>

        {/* Main content */}
        <div className="flex-grow-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
