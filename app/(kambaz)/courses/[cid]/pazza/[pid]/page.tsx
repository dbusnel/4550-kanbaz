"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { useEffect, useState } from "react";

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
    </div>
  );
}
