"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";

const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];

export default function PazzaHome() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [posts, setPosts] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userId =
    currentUser && "_id" in currentUser ? (currentUser as any)._id : null;

  useEffect(() => {
    if (!cid || !userId) return;
    Promise.all([
      client.getAllPazzaPosts(cid as string, userId),
      client.getCourseUsers(cid as string),
    ]).then(([fetchedPosts, users]) => {
      setPosts(fetchedPosts);
      const students = users.filter(
        (u: any) => !INSTRUCTOR_ROLES.includes(u.role?.toUpperCase()),
      );
      setStudentCount(students.length);
      setLoading(false);
    });
  }, [cid, userId]);

  if (loading) return <p className="text-muted">Loading…</p>;

  const unread = posts.filter((p) => p.unread).length;
  const unanswered = posts.filter((p) => p.type === "question" && !p.answered).length;
  const total = posts.length;
  const instructorResponses = posts.reduce(
    (sum, p) => sum + (p.instructorAnswers?.length ?? 0), 0,
  );
  const studentResponses = posts.reduce(
    (sum, p) => sum + (p.studentAnswers?.length ?? 0), 0,
  );

  const stats = [
    { value: unread, label: "Unread posts", zeroLabel: "No unread posts" },
    { value: unanswered, label: "Unanswered posts", zeroLabel: "No unanswered posts" },
    { value: total, label: "Total posts" },
    { value: instructorResponses, label: "Instructor responses" },
    { value: studentResponses, label: "Student responses" },
    { value: studentCount ?? "—", label: "Students enrolled" },
  ];

  return (
    <div>
      <h4 style={{ fontWeight: "600", marginBottom: "3rem" }}>Class at a Glance</h4>
    <div className="d-flex flex-column align-items-center">
      <div className="row g-2" style={{ maxWidth: 480, width: "100%" }}>
        {stats.map((s) => (
          <div key={s.label} className="col-6">
            <div className="border rounded p-3" style={{ backgroundColor: "#fafafa" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 600, color: "#212529" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                {s.value === 0 && s.zeroLabel ? s.zeroLabel : s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
