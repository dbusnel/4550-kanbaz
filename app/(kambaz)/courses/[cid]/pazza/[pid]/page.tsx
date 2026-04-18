"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TbSquareLetterSFilled, TbSquareLetterIFilled } from "react-icons/tb";
import { Dropdown } from "react-bootstrap";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaUserCircle } from "react-icons/fa";
import DOMPurify from "dompurify";

interface UserInfo {
  firstName: string;
  lastName: string;
  _id: string;
}

interface PazzaAnswer {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PazzaDiscussion {
  id: string;
  authorId: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  replies: { id: string; authorId: string; content: string; createdAt: string; updatedAt: string }[];
}

interface PazzaPost {
  id: string;
  courseId: string;
  type: "question" | "note";
  summary: string;
  details: string;
  authorId: string;
  authorInfo: { firstName: string; lastName: string };
  answered: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  folderIds: string[];
  studentAnswers: PazzaAnswer[];
  instructorAnswers: PazzaAnswer[];
  followUpDiscussions: PazzaDiscussion[];
}

const CATEGORY_COLORS: Record<string, string> = {
  logistics: "primary",
  homework: "warning",
  announcements: "danger",
  general: "secondary",
};

export default function PazzaPost() {
  const { cid, pid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const [value, setValue] = useState("");
  const [displayPost, setDisplayPost] = useState<PazzaPost | undefined>(undefined);
  const [userCache, setUserCache] = useState<Record<string, { firstName: string; lastName: string }>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingAnswer, setEditingAnswer] = useState<"student" | "instructor" | null>(null);
  const [editContent, setEditContent] = useState("");
  const [newStudentContent, setNewStudentContent] = useState("");
  const [newInstructorContent, setNewInstructorContent] = useState("");
  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editDiscussionContent, setEditDiscussionContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [editingPost, setEditingPost] = useState(false);
  const [editSummary, setEditSummary] = useState("");
  const [editDetails, setEditDetails] = useState("");

  const nameInfo: UserInfo = { firstName: "", lastName: "", _id: "" };
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
    let cancelled = false;
    const fetchPost = async () => {
      if (pid === undefined || cid === undefined) return undefined;
      const post = await client.getPostById(
        cid as string,
        nameInfo._id,
        pid as string,
      );

      const authorInfo = await client.getUserById(post.authorId);

      const authorIds = new Set<string>();
      for (const disc of post.followUpDiscussions ?? []) {
        if (disc.authorId) authorIds.add(disc.authorId);
        for (const reply of disc.replies ?? []) {
          if (reply.authorId) authorIds.add(reply.authorId);
        }
      }
      const userEntries = await Promise.all(
        [...authorIds].map(async (id) => {
          const user = await client.getUserById(id);
          return [id, user] as [string, { firstName: string; lastName: string }];
        }),
      );

      if (cancelled) return;
      setUserCache(Object.fromEntries(userEntries));
      setDisplayPost({ authorInfo: authorInfo, ...post });

      const { viewCount } = await client.incrementPazzaViewCount(cid as string, nameInfo._id, pid as string);
      if (!cancelled) setDisplayPost((prev) => prev ? { ...prev, viewCount } : prev);
    };
    fetchPost();
    return () => { cancelled = true; };
  }, [cid, nameInfo._id, pid]);

  useEffect(() => {
    if (!cid) return;
    client.getPazzaFolders(cid as string).then(setFolders);
  }, [cid]);

  if (displayPost === undefined) {
    return <h1>Loading...</h1>;
  }

  const author = `${nameInfo.firstName} ${nameInfo.lastName}`;
  const sanitize = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  const getUserName = (id: string) => {
    const u = userCache[id];
    return u ? `${u.firstName} ${u.lastName}` : "Unknown";
  };
  const viewCount = displayPost.viewCount ?? 0;
  const createdAt = displayPost.createdAt
    ? new Date(displayPost.createdAt).toLocaleString()
    : "N/A";
  const updatedAt = displayPost.updatedAt
    ? new Date(displayPost.updatedAt).toLocaleString()
    : "N/A";

  const handleSetResolved = async (discussionId: string, resolved: boolean) => {
    await client.setDiscussionResolved(
      cid as string,
      nameInfo._id,
      pid as string,
      discussionId,
      resolved,
    );
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.map((d) =>
        d.id === discussionId ? { ...d, resolved } : d,
      ),
    }));
  };

  const submitDiscussion = async () => {
    // ReactQuill emits "<p><br></p>" for an empty editor
    if (!value.trim() || value === "<p><br></p>") return;
    const discussion = await client.addFollowUpDiscussion(
      cid as string,
      nameInfo._id,
      pid as string,
      value,
    );
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: [...prev!.followUpDiscussions, discussion],
    }));
    setUserCache((prev) => ({
      ...prev,
      [nameInfo._id]: { firstName: nameInfo.firstName, lastName: nameInfo.lastName },
    }));
    setValue("");
  };

  const submitReply = async (discussionId: string) => {
    if (!replyText.trim()) return;
    const reply = await client.addReplyToDiscussion(
      cid as string,
      nameInfo._id,
      pid as string,
      discussionId,
      replyText.trim(),
    );
    // Optimistically add the reply and cache the current user as its author
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.map((d) =>
        d.id === discussionId
          ? { ...d, replies: [...d.replies, reply] }
          : d,
      ),
    }));
    setUserCache((prev) => ({
      ...prev,
      [nameInfo._id]: { firstName: nameInfo.firstName, lastName: nameInfo.lastName },
    }));
    setReplyText("");
    setReplyingTo(null);
  };

  const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];
  const isInstructor = INSTRUCTOR_ROLES.includes((currentUser as any)?.role?.toUpperCase());

  const studentAnswer = displayPost.studentAnswers[0] ?? undefined;
  const instructorAnswer = displayPost.instructorAnswers[0] ?? undefined;

  const canActOnStudentAnswer = (answer: any) =>
    isInstructor || answer?.authorId === nameInfo._id;

  const handleStartEdit = (type: "student" | "instructor", content: string) => {
    setEditingAnswer(type);
    setEditContent(content);
  };

  const handleSaveAnswer = async (type: "student" | "instructor") => {
    if (!editContent.trim() || editContent === "<p><br></p>") return;
    if (type === "student") {
      const updated = await client.updateStudentAnswer(cid as string, nameInfo._id, pid as string, studentAnswer.id, editContent);
      setDisplayPost((prev) => ({ ...prev!, studentAnswers: prev!.studentAnswers.map((a) => a.id === studentAnswer.id ? updated : a) }));
    } else {
      const updated = await client.updateInstructorAnswer(cid as string, nameInfo._id, pid as string, instructorAnswer.id, editContent);
      setDisplayPost((prev) => ({ ...prev!, instructorAnswers: prev!.instructorAnswers.map((a) => a.id === instructorAnswer.id ? updated : a) }));
    }
    setEditingAnswer(null);
  };

  const handleDeleteAnswer = async (type: "student" | "instructor", answerId: string) => {
    if (type === "student") {
      await client.deleteStudentAnswer(cid as string, nameInfo._id, pid as string, answerId);
      setDisplayPost((prev) => ({
        ...prev!,
        studentAnswers: prev!.studentAnswers.filter((a) => a.id !== answerId),
        answered: prev!.instructorAnswers.length > 0,
      }));
    } else {
      await client.deleteInstructorAnswer(cid as string, nameInfo._id, pid as string, answerId);
      setDisplayPost((prev) => ({
        ...prev!,
        instructorAnswers: prev!.instructorAnswers.filter((a) => a.id !== answerId),
        answered: prev!.studentAnswers.length > 0,
      }));
    }
  };

  const handlePostStudentAnswer = async () => {
    if (!newStudentContent.trim() || newStudentContent === "<p><br></p>") return;
    const answer = await client.createStudentAnswer(cid as string, nameInfo._id, pid as string, newStudentContent);
    setDisplayPost((prev) => ({ ...prev!, studentAnswers: [...prev!.studentAnswers, answer], answered: true }));
    setNewStudentContent("");
  };

  const handleSaveDiscussion = async (discussionId: string) => {
    if (!editDiscussionContent.trim() || editDiscussionContent === "<p><br></p>") return;
    const updated = await client.updateFollowUpDiscussion(cid as string, nameInfo._id, pid as string, discussionId, editDiscussionContent);
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.map((d) => d.id === discussionId ? { ...d, ...updated } : d),
    }));
    setEditingDiscussionId(null);
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    await client.deleteFollowUpDiscussion(cid as string, nameInfo._id, pid as string, discussionId);
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.filter((d) => d.id !== discussionId),
    }));
  };

  const handleSaveReply = async (discussionId: string, replyId: string) => {
    if (!editReplyContent.trim()) return;
    const updated = await client.updateReply(cid as string, nameInfo._id, pid as string, discussionId, replyId, editReplyContent);
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.map((d) =>
        d.id === discussionId
          ? { ...d, replies: d.replies.map((r) => r.id === replyId ? { ...r, ...updated } : r) }
          : d,
      ),
    }));
    setEditingReplyId(null);
  };

  const handleDeleteReply = async (discussionId: string, replyId: string) => {
    await client.deleteReply(cid as string, nameInfo._id, pid as string, discussionId, replyId);
    setDisplayPost((prev) => ({
      ...prev!,
      followUpDiscussions: prev!.followUpDiscussions.map((d) =>
        d.id === discussionId
          ? { ...d, replies: d.replies.filter((r) => r.id !== replyId) }
          : d,
      ),
    }));
  };

  const handleSavePost = async () => {
    if (!editSummary.trim()) return;
    const updated = await client.updatePazzaPost(cid as string, nameInfo._id, pid as string, { summary: editSummary, details: editDetails });
    setDisplayPost((prev) => ({ ...prev!, ...updated }));
    setEditingPost(false);
  };

  const handleDeletePost = async () => {
    await client.deletePazzaPostById(cid as string, nameInfo._id, pid as string);
    router.push(`/courses/${cid}/pazza`);
  };

  const handlePostInstructorAnswer = async () => {
    if (!newInstructorContent.trim() || newInstructorContent === "<p><br></p>") return;
    const answer = await client.createInstructorAnswer(cid as string, nameInfo._id, pid as string, newInstructorContent);
    setDisplayPost((prev) => ({ ...prev!, instructorAnswers: [...prev!.instructorAnswers, answer], answered: true }));
    setNewInstructorContent("");
  };

  const postFolders = folders.filter((f) => displayPost.folderIds?.includes(f.id));

  return (
    <div>
      <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
        <h1 style={{ fontWeight: "bold", marginBottom: 0 }}>{displayPost.summary}</h1>
        {(isInstructor || displayPost.authorId === nameInfo._id) && !editingPost && (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm" style={{ whiteSpace: "nowrap" }}>Actions</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setEditingPost(true); setEditSummary(displayPost.summary); setEditDetails(displayPost.details); }}>Edit</Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={handleDeletePost}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      <div style={{ color: "#555", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
        <span>By {`${displayPost.authorInfo.firstName} ${displayPost.authorInfo.lastName}`}</span>
        <span style={{ margin: "0 0.5rem" }}>·</span>
        <span>Posted: {createdAt}</span>
        <span style={{ margin: "0 0.5rem" }}>·</span>
        <span>Last updated: {updatedAt}</span>
      </div>

      {postFolders.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {postFolders.map((f) => (
            <span
              key={f.id}
              className={`badge text-bg-${CATEGORY_COLORS[f.name.toLowerCase()] ?? "secondary"}`}
            >
              {f.name}
            </span>
          ))}
        </div>
      )}

      {editingPost ? (
        <div className="mt-3">
          <input
            type="text"
            className="form-control mb-2"
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            placeholder="Summary"
          />
          <ReactQuill theme="snow" value={editDetails} onChange={setEditDetails} />
          <div className="d-flex gap-2 mt-2">
            <button className="btn btn-primary btn-sm" onClick={handleSavePost}>Save</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingPost(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div
          style={{ fontSize: "1.125rem" }}
          dangerouslySetInnerHTML={{ __html: sanitize(displayPost.details ?? "") }}
        />
      )}

      <div style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem", textAlign: "right" }}>
        {viewCount} view{viewCount !== 1 ? "s" : ""}
      </div>
      <hr />
      {displayPost.type === "question" && (
        <div>
          {/* Student answer */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="d-flex align-items-center gap-2">
              <TbSquareLetterSFilled style={{ fontSize: "32px" }} />
              <h3 className="mb-0">Student answer</h3>
            </span>
            {studentAnswer && canActOnStudentAnswer(studentAnswer) && editingAnswer !== "student" && (
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">Actions</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStartEdit("student", studentAnswer.content)}>Edit</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleDeleteAnswer("student", studentAnswer.id)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {studentAnswer ? (
            editingAnswer === "student" ? (
              <div>
                <ReactQuill theme="snow" value={editContent} onChange={setEditContent} />
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleSaveAnswer("student")}>Save</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingAnswer(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "0.85rem", color: "#888" }}>
                  Last updated at {new Date(studentAnswer.updatedAt).toLocaleString()}
                </p>
                <div dangerouslySetInnerHTML={{ __html: sanitize(studentAnswer.content) }} />
              </div>
            )
          ) : isInstructor ? (
            <p className="text-muted fst-italic">No student answer yet.</p>
          ) : (
            <div>
              <ReactQuill theme="snow" value={newStudentContent} onChange={setNewStudentContent} />
              <button className="btn btn-primary btn-sm mt-2" onClick={handlePostStudentAnswer}>Post Answer</button>
            </div>
          )}

          <hr />

          {/* Instructor answer */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="d-flex align-items-center gap-2">
              <TbSquareLetterIFilled style={{ fontSize: "32px" }} />
              <h3 className="mb-0">Instructor answer</h3>
            </span>
            {instructorAnswer && isInstructor && editingAnswer !== "instructor" && (
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">Actions</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStartEdit("instructor", instructorAnswer.content)}>Edit</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={() => handleDeleteAnswer("instructor", instructorAnswer.id)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {instructorAnswer ? (
            editingAnswer === "instructor" ? (
              <div>
                <ReactQuill theme="snow" value={editContent} onChange={setEditContent} />
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleSaveAnswer("instructor")}>Save</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingAnswer(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "0.85rem", color: "#888" }}>
                  Last updated at {new Date(instructorAnswer.updatedAt).toLocaleString()}
                </p>
                <div dangerouslySetInnerHTML={{ __html: sanitize(instructorAnswer.content) }} />
              </div>
            )
          ) : isInstructor ? (
            <div>
              <ReactQuill theme="snow" value={newInstructorContent} onChange={setNewInstructorContent} />
              <button className="btn btn-primary btn-sm mt-2" onClick={handlePostInstructorAnswer}>Post Answer</button>
            </div>
          ) : (
            <p className="text-muted fst-italic">No instructor answer yet.</p>
          )}

          <hr />
        </div>
      )}
      <div className="mt-4">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
          Follow-up Discussions
        </h3>
        <hr className="mt-0" />

        {displayPost.followUpDiscussions.length === 0 && (
          <p className="text-muted fst-italic" style={{ fontSize: "0.9rem" }}>
            No follow-up discussions yet.
          </p>
        )}

        {displayPost.followUpDiscussions.map((discussion) => (
          <div key={discussion.id} className="border rounded mb-3">
            {/* Discussion body */}
            <div className="px-3 pt-3 pb-2 bg-light">
              {nameInfo._id === discussion.authorId && (
                <div className="d-inline-flex gap-3 mb-2 px-2 py-1 rounded" style={{ fontSize: "0.78rem", color: "#555", backgroundColor: discussion.resolved ? "#d1fae5" : "#fef9c3" }}>
                  <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`resolved-${discussion.id}`}
                      checked={!discussion.resolved}
                      onChange={() => handleSetResolved(discussion.id, false)}
                    />
                    Unresolved
                  </label>
                  <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`resolved-${discussion.id}`}
                      checked={!!discussion.resolved}
                      onChange={() => handleSetResolved(discussion.id, true)}
                    />
                    Resolved
                  </label>
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <FaUserCircle style={{ fontSize: "16px", color: "#555", flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {getUserName(discussion.authorId)}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(discussion.createdAt).toLocaleString()}
                  </span>
                </div>
                {(isInstructor || discussion.authorId === nameInfo._id) && editingDiscussionId !== discussion.id && (
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">Actions</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => { setEditingDiscussionId(discussion.id); setEditDiscussionContent(discussion.content); }}>Edit</Dropdown.Item>
                      <Dropdown.Item className="text-danger" onClick={() => handleDeleteDiscussion(discussion.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              {editingDiscussionId === discussion.id ? (
                <div>
                  <ReactQuill theme="snow" value={editDiscussionContent} onChange={setEditDiscussionContent} />
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveDiscussion(discussion.id)}>Save</button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingDiscussionId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: sanitize(discussion.content) }} />
              )}
            </div>

            {/* Replies */}
            {discussion.replies.map((reply) => (
              <div key={reply.id} className="px-3 py-2 border-top" style={{ paddingLeft: "2rem" }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <FaUserCircle style={{ fontSize: "13px", color: "#888", flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "#555" }}>
                      {getUserName(reply.authorId)}
                    </span>
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {(isInstructor || reply.authorId === nameInfo._id) && editingReplyId !== reply.id && (
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">Actions</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setEditingReplyId(reply.id); setEditReplyContent(reply.content); }}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDeleteReply(discussion.id, reply.id)}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
                {editingReplyId === reply.id ? (
                  <div>
                    <textarea
                      autoFocus
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      rows={2}
                      className="form-control form-control-sm mb-2"
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveReply(discussion.id, reply.id)}>Save</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingReplyId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-0" style={{ fontSize: "0.875rem" }}>{reply.content}</p>
                )}
              </div>
            ))}

            {/* Reply input / button */}
            {replyingTo === discussion.id ? (
              <div className="px-3 py-2 border-top bg-light">
                <textarea
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply…"
                  rows={2}
                  className="form-control form-control-sm mb-2"
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => submitReply(discussion.id)}>Submit</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 border-top">
                <button
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => { setReplyingTo(discussion.id); setReplyText(""); }}
                >
                  + Reply
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Compose new discussion */}
        <div className="mt-3">
          <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem" }}>Start a follow-up discussion</p>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
          <button className="btn btn-primary btn-sm mt-2" onClick={submitDiscussion}>
            Post Discussion
          </button>
        </div>
      </div>
    </div>
  );
}
