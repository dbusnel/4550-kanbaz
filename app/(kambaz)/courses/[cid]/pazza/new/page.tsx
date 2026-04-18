"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { TbCircleLetterIFilled } from "react-icons/tb";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const POST_TYPES = ["question", "note"];
const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];

interface Folder { id: string; name: string; }
interface CourseUser { _id: string; firstName: string; lastName: string; role: string; }

export default function NewPazzaPost() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [summary, setSummary] = useState("");
  const [type, setType] = useState("question");
  const [details, setDetails] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"entire_class" | "individual">("entire_class");
  const [courseUsers, setCourseUsers] = useState<CourseUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId =
    currentUser && "_id" in currentUser ? (currentUser as any)._id : null;

  useEffect(() => {
    if (!cid) return;
    client.getPazzaFolders(cid as string).then(setFolders);
    client.getCourseUsers(cid as string).then(setCourseUsers);
  }, [cid]);

  const instructors = courseUsers.filter((u) =>
    INSTRUCTOR_ROLES.includes(u.role?.toUpperCase()),
  );
  const students = courseUsers.filter(
    (u) => !INSTRUCTOR_ROLES.includes(u.role?.toUpperCase()),
  );
  const allInstructorIds = instructors.map((u) => u._id);
  const allInstructorsSelected =
    allInstructorIds.length > 0 &&
    allInstructorIds.every((id) => selectedUsers.includes(id));

  const toggleUser = (uid: string) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  const toggleAllInstructors = () => {
    if (allInstructorsSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !allInstructorIds.includes(id)));
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...allInstructorIds])]);
    }
  };

  const toggleFolder = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId],
    );
  };

  const handleSubmit = async () => {
    if (!summary.trim()) { setError("Title is required."); return; }
    if (selectedFolders.length === 0) { setError("At least one folder must be selected."); return; }
    if (visibility === "individual" && selectedUsers.length === 0) {
      setError("Select at least one user for individual visibility.");
      return;
    }
    if (!userId || !cid) return;
    setSubmitting(true);
    setError("");
    try {
      const post = await client.createPazzaPost(cid as string, userId, {
        summary: summary.trim(),
        type,
        details,
        folderIds: selectedFolders,
        visibility,
        visibleTo: visibility === "individual" ? selectedUsers : [],
      });
      router.push(`/courses/${cid}/pazza/${post.id}`);
    } catch {
      setError("Failed to create post. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "1.5rem" }}>New Post</h2>

      {error && (
        <div className="alert alert-danger py-2" style={{ fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label fw-semibold">Title</label>
        <input
          className="form-control"
          placeholder="Summarize your post in one line"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Type</label>
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
          {POST_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">
          Folders <span className="text-muted fw-normal">(select at least one)</span>
        </label>
        {folders.length === 0 ? (
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>Loading folders…</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {folders.map((folder) => {
              const checked = selectedFolders.includes(folder.id);
              return (
                <button
                  key={folder.id}
                  type="button"
                  className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => toggleFolder(folder.id)}
                >
                  {folder.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Visibility</label>
        <div className="d-flex flex-column gap-1">
          <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="visibility"
              checked={visibility === "entire_class"}
              onChange={() => setVisibility("entire_class")}
            />
            Entire Class
          </label>
          <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="visibility"
              checked={visibility === "individual"}
              onChange={() => setVisibility("individual")}
            />
            Individual Students/Instructors
          </label>
        </div>

        {visibility === "individual" && (
          <div
            className="mt-2 border rounded"
            style={{ maxHeight: 220, overflowY: "auto", fontSize: "0.875rem" }}
          >
            {/* Instructors group */}
            <div
              className="px-3 py-2 border-bottom d-flex align-items-center gap-2"
              style={{ backgroundColor: "#f8f9fa", fontWeight: 600 }}
            >
              <input
                type="checkbox"
                id="group-instructors"
                checked={allInstructorsSelected}
                onChange={toggleAllInstructors}
              />
              <label htmlFor="group-instructors" style={{ cursor: "pointer", margin: 0 }}>
                Instructors
              </label>
            </div>
            {instructors.map((u) => (
              <div key={u._id} className="px-4 py-1 d-flex align-items-center gap-2 border-bottom">
                <TbCircleLetterIFilled style={{ fontSize: "1rem", color: "#000", flexShrink: 0 }} />
                <input
                  type="checkbox"
                  id={`user-${u._id}`}
                  checked={selectedUsers.includes(u._id)}
                  onChange={() => toggleUser(u._id)}
                />
                <label htmlFor={`user-${u._id}`} style={{ cursor: "pointer", margin: 0 }}>
                  {u.firstName} {u.lastName}
                </label>
              </div>
            ))}
            {/* Students */}
            {students.map((u) => (
              <div key={u._id} className="px-3 py-1 d-flex align-items-center gap-2 border-bottom">
                <input
                  type="checkbox"
                  id={`user-${u._id}`}
                  checked={selectedUsers.includes(u._id)}
                  onChange={() => toggleUser(u._id)}
                />
                <label htmlFor={`user-${u._id}`} style={{ cursor: "pointer", margin: 0 }}>
                  {u.firstName} {u.lastName}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Details</label>
        <ReactQuill theme="snow" value={details} onChange={setDetails} />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating…" : "Create Post"}
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push(`/courses/${cid}/pazza`)}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
