import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image
              src="/images/distributed-system.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS4750 Distributed Systems </h5>
              <p className="wd-dashboard-course-title">Systems engineering</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1235" className="wd-dashboard-course-link">
            <Image
              src="/images/syssec.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CY3550 Systems Security </h5>
              <p className="wd-dashboard-course-title">Security analysis</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1236" className="wd-dashboard-course-link">
            <Image
              src="/images/webdev.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS4550 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1237" className="wd-dashboard-course-link">
            <Image
              src="/images/softeng.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS4530 Software Engineering </h5>
              <p className="wd-dashboard-course-title">Software engineer</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1238" className="wd-dashboard-course-link">
            <Image
              src="/images/networks.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS4700 Network Fundamentals </h5>
              <p className="wd-dashboard-course-title">Network developer</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1239" className="wd-dashboard-course-link">
            <Image
              src="/images/digitaldesign.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> EECE2310 Foundations of Digital Design </h5>
              <p className="wd-dashboard-course-title">Computer engineer</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1240" className="wd-dashboard-course-link">
            <Image
              src="/images/systems.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS3650 Computer Systems </h5>
              <p className="wd-dashboard-course-title">Systems engineer</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
