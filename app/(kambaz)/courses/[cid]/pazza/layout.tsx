"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { MdOutlineForum } from "react-icons/md";
import { Nav, NavItem, NavLink, Accordion } from "react-bootstrap";
import "./style.css";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import { useState, useEffect, useMemo } from "react";
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

// Returns the Monday (start) of the Mon–Sun week containing `date`.
function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

function formatWeekLabel(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)} - ${fmt(sunday)}`;
}

interface PostGroup {
  label: string;
  posts: any[];
  sortKey: number; // epoch ms of group start, descending
}

function groupPosts(posts: any[]): PostGroup[] {
  const now = new Date();
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(todayMidnight.getDate() - 1);

  const thisWeekMonday = getWeekMonday(todayMidnight);
  const lastWeekMonday = new Date(thisWeekMonday);
  lastWeekMonday.setDate(thisWeekMonday.getDate() - 7);
  const lastWeekSunday = new Date(thisWeekMonday);
  lastWeekSunday.setDate(thisWeekMonday.getDate() - 1);

  const todayPosts: any[] = [];
  const yesterdayPosts: any[] = [];
  const lastWeekPosts: any[] = [];
  const olderMap = new Map<string, { posts: any[]; monday: Date }>();

  for (const post of posts) {
    const created = new Date(post.createdAt);
    created.setHours(0, 0, 0, 0);
    const t = created.getTime();

    if (t === todayMidnight.getTime()) {
      todayPosts.push(post);
    } else if (t === yesterdayMidnight.getTime()) {
      yesterdayPosts.push(post);
    } else if (t >= lastWeekMonday.getTime() && t <= lastWeekSunday.getTime()) {
      lastWeekPosts.push(post);
    } else {
      const monday = getWeekMonday(created);
      const label = formatWeekLabel(monday);
      if (!olderMap.has(label)) {
        olderMap.set(label, { posts: [], monday });
      }
      olderMap.get(label)!.posts.push(post);
    }
  }

  const sortDesc = (a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const groups: PostGroup[] = [];
  if (todayPosts.length > 0)
    groups.push({
      label: "Today",
      posts: todayPosts.sort(sortDesc),
      sortKey: todayMidnight.getTime(),
    });
  if (yesterdayPosts.length > 0)
    groups.push({
      label: "Yesterday",
      posts: yesterdayPosts.sort(sortDesc),
      sortKey: yesterdayMidnight.getTime(),
    });
  if (lastWeekPosts.length > 0)
    groups.push({
      label: "Last Week",
      posts: lastWeekPosts.sort(sortDesc),
      sortKey: lastWeekMonday.getTime(),
    });

  const sortedOlder = [...olderMap.values()].sort(
    (a, b) => b.monday.getTime() - a.monday.getTime(),
  );
  for (const { posts: p, monday } of sortedOlder) {
    groups.push({
      label: formatWeekLabel(monday),
      posts: p.sort(sortDesc),
      sortKey: monday.getTime(),
    });
  }

  return groups;
}

function PostCard({
  post,
  cid,
  pathname,
}: {
  post: any;
  cid: string;
  pathname: string;
}) {
  const href = `/courses/${cid}/pazza/${post.id}`;
  const active = pathname === href;
  return (
    <Link
      href={active ? `/courses/${cid}/pazza` : href}
      className={`list-group-item list-group-item-action border-0 border-bottom px-3 py-2 ${active ? "active" : ""}`}
      style={{ fontSize: 14 }}
    >
      <div className="d-flex align-items-start gap-2">
        {post.unread && !active ? (
          <span
            className="bg-primary rounded-circle mt-1"
            style={{ width: 8, height: 8, flexShrink: 0 }}
          />
        ) : (
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
          <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
            <span
              className={`badge text-bg-${CATEGORY_COLORS[post.type] ?? "secondary"}`}
              style={{ fontSize: 10 }}
            >
              {post.type}
            </span>
            {post.answered && (
              <span className="badge text-bg-success" style={{ fontSize: 10 }}>
                answered
              </span>
            )}
            {(() => {
              const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];
              const isInstructorPost = INSTRUCTOR_ROLES.includes(
                post.authorRole?.toUpperCase(),
              );
              return (
                <span
                  className={`badge ${isInstructorPost ? "text-bg-dark" : "text-bg-light border"}`}
                  style={{ fontSize: 10 }}
                >
                  {isInstructorPost ? "Instructor" : "Student"}
                </span>
              );
            })()}
          </div>
          {post.createdAt && (
            <div
              style={{
                fontSize: 11,
                color: active ? undefined : "#9ca3af",
                marginTop: 2,
              }}
            >
              {new Date(post.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

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
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
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
      if (nameInfo === null || cid === undefined) return;
      const fetched = await client.getAllPazzaPosts(
        cid as string,
        nameInfo._id,
      );
      setPosts(fetched);
    };
    fetchPosts();
  }, [currentUser, cid, pathname]);

  useEffect(() => {
    if (!cid) return;
    client.getPazzaFolders(cid as string).then(setFolders);
  }, [cid, pathname]);

  const toggleFolderFilter = (folderId: string) => {
    setActiveFolder((prev) => (prev === folderId ? null : folderId));
  };

  const filteredGroups = useMemo(() => {
    const filtered = posts.filter((post: any) => {
      if (activeFolder && !post.folderIds?.includes(activeFolder)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !post.summary?.toLowerCase().includes(q) &&
          !post.details?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    return groupPosts(filtered);
  }, [posts, activeFolder, searchQuery]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  useEffect(() => {
    const labels = filteredGroups.map((g) => g.label);
    setOpenKeys((prev) => {
      const added = labels.filter((l) => !prev.includes(l));
      return added.length > 0 ? [...prev, ...added] : prev;
    });
  }, [filteredGroups]);

  if (currentUser === null || cid === undefined)
    return (
      <div>
        <p>Please log in.</p>
      </div>
    );

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
      {/* Top navbar */}
      <Nav
        className="d-flex align-items-center px-3 py-1 gap-1"
        style={{ backgroundColor: "#70b9e0" }}
      >
        <div className="d-flex align-items-center gap-2 me-2">
          <MdOutlineForum size={18} style={{ color: "#fff" }} />
          <span className="fw-semibold" style={{ color: "#fff", fontSize: 15 }}>
            Pazza
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            ·
          </span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            {cid}
          </span>
        </div>
        <NavItem>
          <Link
            href={`/courses/${cid}/pazza`}
            className="nav-link"
            style={{
              color: "#fff",
              fontWeight:
                pathname.endsWith("pazza") && !pathname.endsWith("manage")
                  ? 700
                  : 400,
            }}
          >
            Q &amp; A
          </Link>
        </NavItem>
        {isInstructor && (
          <NavItem>
            <Link
              href={`/courses/${cid}/pazza/manage`}
              className="nav-link"
              style={{
                color: "#fff",
                fontWeight: pathname.endsWith("manage") ? 700 : 400,
              }}
            >
              Manage class
            </Link>
          </NavItem>
        )}
        <div className="ms-auto d-flex align-items-center gap-2">
          <FaCircleUser size={18} style={{ color: "#fff" }} />
          <span
            style={{ color: "#fff", fontSize: 13 }}
          >{`${(currentUser as any).firstName} ${(currentUser as any).lastName}`}</span>
        </div>
      </Nav>

      {/* Filter bar */}
      {!isManagePage && (
        <div
          className="d-flex align-items-center gap-2 px-3 py-1 border-bottom bg-light"
          style={{ flexShrink: 0, fontSize: 13 }}
        >
          <button
            className="btn btn-sm btn-link p-0 text-secondary"
            onClick={() => setSidebarVisible((v) => !v)}
            title={sidebarVisible ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarVisible ? (
              <GoTriangleLeft size={16} />
            ) : (
              <GoTriangleRight size={16} />
            )}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary py-0"
            style={{ fontSize: 12 }}
            onClick={() => setActiveFolder(null)}
          >
            Clear
          </button>
          <div className="vr mx-1" />
          <span className="text-muted me-1">Filter:</span>
          {folders.map((folder) => {
            const color =
              CATEGORY_COLORS[folder.name.toLowerCase()] ?? "secondary";
            const active = activeFolder === folder.id;
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
          {isInstructor && (
            <Link
              href={`/courses/${cid}/pazza/manage`}
              className="ms-auto text-decoration-none"
              style={{ fontSize: 12, color: "#6c757d", whiteSpace: "nowrap" }}
            >
              Manage and reorder folders
            </Link>
          )}
        </div>
      )}

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
                className="btn btn-primary d-inline-flex align-items-center gap-1"
                style={{ fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }}
                onClick={() => router.push(`/courses/${cid}/pazza/new`)}
              >
                <FaPlus style={{ fontSize: 11 }} />
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

            {filteredGroups.length === 0 ? (
              <p
                className="text-muted text-center py-3"
                style={{ fontSize: 13 }}
              >
                No posts found.
              </p>
            ) : (
              <Accordion
                activeKey={openKeys}
                onSelect={(k) => setOpenKeys(k as string[])}
                alwaysOpen
                flush
              >
                {filteredGroups.map((group) => (
                  <Accordion.Item key={group.label} eventKey={group.label}>
                    <Accordion.Header>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#495057",
                        }}
                      >
                        {group.label}
                      </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                      <div className="list-group list-group-flush">
                        {group.posts.map((post: any) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            cid={cid as string}
                            pathname={pathname}
                          />
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
