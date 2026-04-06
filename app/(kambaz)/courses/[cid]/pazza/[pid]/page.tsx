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
      setDisplayPost({ authorInfo: authorInfo, ...post });
    };
    fetchPost();
  }, [cid, nameInfo._id, pid]);

  if (displayPost === undefined) {
    return <h1>Loading...</h1>;
  }

  const author = `${nameInfo.firstName} ${nameInfo.lastName}`;
  const viewCount = displayPost.viewCount ?? 0;
  const createdAt = displayPost.createdAt
    ? new Date(displayPost.createdAt).toLocaleString()
    : "N/A";
  const updatedAt = displayPost.updatedAt
    ? new Date(displayPost.updatedAt).toLocaleString()
    : "N/A";

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
      <div>
        <h3>Follow-up discussions</h3>
        {displayPost.followUpDiscussions.map((discussion) => {
          console.log(discussion.replies);
          return (
            <div key={discussion.id}>
              <div>
                <span className="flex flex-row">
                  <FaUserCircle className="w-10" style={{ fontSize: "26px" }} />
                  <p className="font-bold">John Doe</p>
                </span>
                <p>{discussion.content}</p>
              </div>
              {discussion.replies.map((reply) => {
                return <p key={reply.id}>{reply.content}</p>;
              })}
            </div>
          );
        })}
      </div>
      <div>
        <h5>Start a follow-up discussion</h5>
        <ReactQuill theme="snow" value={value} onChange={setValue} />
      </div>
    </div>
  );
}
