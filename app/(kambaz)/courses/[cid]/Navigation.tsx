"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
export default function CourseNavigation() {
  const links = [
    "Home",
    "Modules",
    "Pazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];
  const pathName = usePathname();
  const { cid } = useParams();
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/courses/${cid}/${link.toLowerCase()}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          className={`list-group-item ${pathName.includes(link.toLowerCase()) ? "active text-danger" : "text-danger"} border-0`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
