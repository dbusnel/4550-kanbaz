"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { useEffect, useState } from "react";
import { TbSquareLetterSFilled, TbSquareLetterIFilled } from "react-icons/tb";
import { FormControl, FormSelect } from "react-bootstrap";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaUserCircle } from "react-icons/fa";
import DOMPurify from "dompurify";

interface userInfo {
  firstName: string;
  lastName: string;
  _id: string;
}

export default function PazzaPost() {
  const { cid, pid } = useParams();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const [value, setValue] = useState("");

  const [displayPost, setDisplayPost] = useState();
  const [userCache, setUserCache] = useState<Record<string, { firstName: string; lastName: string }>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

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
    const fetchPost = async () => {
      if (pid === undefined || cid === undefined) return undefined;
      const post = await client.getPostById(
        cid as string,
        nameInfo._id,
        pid as string,
      );

      const authorInfo = await client.getUserById(post.authorId);

      // Collect all unique author IDs from discussions and their replies
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
      setUserCache(Object.fromEntries(userEntries));

      setDisplayPost({ authorInfo: authorInfo, ...post });
    };
    fetchPost();
  }, [cid, nameInfo._id, pid]);

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
      ...prev,
      followUpDiscussions: prev.followUpDiscussions.map((d) =>
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
      ...prev,
      followUpDiscussions: [...prev.followUpDiscussions, discussion],
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
      ...prev,
      followUpDiscussions: prev.followUpDiscussions.map((d) =>
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

  const studentAnswer = displayPost.studentAnswers[0]
    ? displayPost.studentAnswers[0]
    : undefined;
  const instructorAnswer = displayPost.instructorAnswers[0]
    ? displayPost.instructorAnswers[0]
    : undefined;

  return (
    <div>
      <h1 style={{ fontWeight: "bold" }}>{displayPost.summary}</h1>
      <div
        style={{ color: "#555", fontSize: "0.875rem", marginBottom: "0.25rem" }}
      >
        <span>
          By{" "}
          {`${displayPost.authorInfo.firstName} ${displayPost.authorInfo.lastName}`}
        </span>
        <span style={{ margin: "0 0.5rem" }}>·</span>
        <span>Posted: {createdAt}</span>
        <span style={{ margin: "0 0.5rem" }}>·</span>
        <span>Last updated: {updatedAt}</span>
      </div>
      <br />
      <p style={{ fontSize: "1.125rem" }}>{displayPost.details}</p>
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          textAlign: "right",
        }}
      >
        {viewCount} view{viewCount !== 1 ? "s" : ""}
      </div>
      <hr />
      {displayPost.type === "question" && (
        <div>
          <span className="flex flex-row">
            <TbSquareLetterSFilled
              className="w-10"
              style={{ fontSize: "32px" }}
            />
            <h3>Student answer</h3>
          </span>
          {studentAnswer !== undefined ? (
            <div>
              <p>
                Last updated at{" "}
                {new Date(studentAnswer.updatedAt).toLocaleString()}
              </p>
              <p>{studentAnswer.content}</p>
            </div>
          ) : (
            <p>Enter text here</p>
          )}
          <div className="w-25">
            <FormSelect className="w-4">
              <option value="actions" defaultChecked>
                Actions
              </option>
              <option value="edit"> Edit </option>
              <option value="delete"> Delete </option>
            </FormSelect>
          </div>
          <hr />
          <span className="flex flex-row">
            <TbSquareLetterIFilled
              className="w-10"
              style={{ fontSize: "32px" }}
            />
            <h3>Instructor answer</h3>
          </span>
          {instructorAnswer ? (
            <div>
              <p>
                Last updated at{" "}
                {new Date(instructorAnswer.updatedAt).toLocaleString()}
              </p>
              <p>{instructorAnswer.content}</p>
            </div>
          ) : (
            <p>Enter text here</p>
          )}
          <div className="w-25">
            <FormSelect className="w-4">
              <option value="actions" defaultChecked>
                Actions
              </option>
              <option value="edit"> Edit </option>
              <option value="delete"> Delete </option>
            </FormSelect>
          </div>
          <hr />
        </div>
      )}
      <div style={{ marginTop: "1.5rem" }}>
        <h3
          style={{
            fontWeight: "600",
            fontSize: "1.1rem",
            marginBottom: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #e5e7eb",
            color: "#374151",
          }}
        >
          Follow-up Discussions
        </h3>

        {displayPost.followUpDiscussions.length === 0 && (
          <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.9rem" }}>
            No follow-up discussions yet. Be the first to ask!
          </p>
        )}

        {displayPost.followUpDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            style={{
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {/* Discussion body */}
            <div
              style={{
                padding: "0.875rem 1rem",
                backgroundColor: "#f9fafb",
                borderLeft: "4px solid #6366f1",
              }}
            >
              {/* Resolved toggle — only shown to the discussion author */}
              {nameInfo._id === discussion.authorId && (
                <div
                  className="flex flex-row"
                  style={{
                    gap: "1rem",
                    marginBottom: "0.5rem",
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    display: "inline-flex",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "5px",
                    backgroundColor: discussion.resolved ? "#f0fdf4" : "#fffbeb",
                    border: discussion.resolved ? "1px solid #bbf7d0" : "1px solid #fde68a",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`resolved-${discussion.id}`}
                      checked={!discussion.resolved}
                      onChange={() => handleSetResolved(discussion.id, false)}
                    />
                    Unresolved
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", cursor: "pointer" }}>
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
              <div
                className="flex flex-row"
                style={{ alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}
              >
                <FaUserCircle style={{ fontSize: "20px", color: "#6366f1", flexShrink: 0 }} />
                <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#374151" }}>
                  {getUserName(discussion.authorId)}
                </span>
              </div>
              <div
                style={{ margin: 0, fontSize: "0.9rem", color: "#374151", lineHeight: "1.5" }}
                dangerouslySetInnerHTML={{ __html: sanitize(discussion.content) }}
              />
            </div>

            {/* Replies */}
            <div style={{ backgroundColor: "#ffffff" }}>
              {discussion.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div
                    className="flex flex-row"
                    style={{ alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}
                  >
                    <FaUserCircle
                      style={{ fontSize: "14px", color: "#9ca3af", flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: "600", fontSize: "0.8rem", color: "#6b7280" }}>
                      {getUserName(reply.authorId)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563", lineHeight: "1.5" }}>
                    {reply.content}
                  </p>
                </div>
              ))}

              {/* Reply input */}
              {replyingTo === discussion.id ? (
                <div
                  style={{
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderTop: "1px solid #f3f4f6",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <textarea
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.875rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <div className="flex flex-row" style={{ gap: "0.5rem" }}>
                    <button
                      onClick={() => submitReply(discussion.id)}
                      style={{
                        padding: "0.35rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        backgroundColor: "#6366f1",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      style={{
                        padding: "0.35rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        backgroundColor: "transparent",
                        color: "#6b7280",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "0.5rem 1rem 0.5rem 2.5rem",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <button
                    onClick={() => { setReplyingTo(discussion.id); setReplyText(""); }}
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "#6366f1",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    + Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Compose new discussion */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <h5
            style={{
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "#374151",
              marginBottom: "0.75rem",
            }}
          >
            Start a follow-up discussion
          </h5>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
          <button
            onClick={submitDiscussion}
            style={{
              marginTop: "0.75rem",
              padding: "0.4rem 1.1rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              backgroundColor: "#6366f1",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Post Discussion
          </button>
        </div>
      </div>
    </div>
  );
}
