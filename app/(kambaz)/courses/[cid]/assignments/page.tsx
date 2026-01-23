import Link from "next/link";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>{" "}
      </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link
            href="/courses/1234/assignments/123"
            className="wd-assignment-link"
          >
            A1 - ENV + HTML
          </Link>
          <br />
          Multiple modules | <strong>Not available until</strong> May 6 at
          12:00am | <br />
          <strong>Due</strong> May 13 at 11:59 pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <Link
            href="/courses/1234/assignments/124"
            className="wd-assignment-link"
          >
            A2 - CSS + BOOTSTRAP
          </Link>
          <br />
          Multiple modules | <strong>Not available until</strong> May 13 at
          12:00am | <br />
          <strong>Due</strong> May 20 at 11:59 pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <Link
            href="/courses/1234/assignments/125"
            className="wd-assignment-link"
          >
            A3 - JavaScript + React
          </Link>
          <br />
          Multiple modules | <strong>Not available until</strong> May 20 at
          12:00am | <br />
          <strong>Due</strong> May 27 at 11:59 pm | 100 pts
        </li>
      </ul>
    </div>
  );
}
