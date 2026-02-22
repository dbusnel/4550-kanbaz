"use client";
import React from "react";
import { usePathname } from "next/navigation";

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  return (
    <span>
      Course {course?.name} &gt;{" "}
      {capitalizeFirst(pathname.split("/").pop() || "")}
    </span>
  );
}
