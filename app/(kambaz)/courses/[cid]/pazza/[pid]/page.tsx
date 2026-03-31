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
      setDisplayPost(post);
    };
    fetchPost();
  }, [cid, nameInfo._id, pid]);

  if (displayPost === undefined) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>{displayPost.summary}</h1>
      <p>{displayPost.details}</p>
    </div>
  );
}
