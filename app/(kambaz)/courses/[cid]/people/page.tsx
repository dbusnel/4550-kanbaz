"use client";

import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function PeoplePage() {
  const { cid } = useParams();
  redirect(`/courses/${cid}/people/table`);
}
