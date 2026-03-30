"use client";
import { useParams } from "next/navigation";

const MOCK_POSTS = [
  {
    id: "1",
    title: "When is the midterm?",
    category: "logistics",
    unread: true,
    answered: false,
  },
  {
    id: "2",
    title: "HW3 problem 4 clarification",
    category: "homework",
    unread: true,
    answered: true,
  },
  {
    id: "3",
    title: "Office hours this week",
    category: "announcements",
    unread: false,
    answered: true,
  },
  {
    id: "4",
    title: "Study group for final exam",
    category: "general",
    unread: false,
    answered: false,
  },
  {
    id: "5",
    title: "Lecture slides posted?",
    category: "logistics",
    unread: false,
    answered: true,
  },
];

export default function PazzaPost() {
  const { pid } = useParams();
  const postToDisplay = MOCK_POSTS.find((post) => post.id === pid);
  console.log("ID:" + pid);
  return (
    <div>
      <h1>{postToDisplay?.title}</h1>
      <p>body example</p>
    </div>
  );
}
