"use client";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../courses/reducer";
import { RootState } from "../store";
import * as client from "../courses/client";
import {
  Row,
  Col,
  CardImg,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface User {
  _id: string;
}

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const [showingEnrollments, setShowingEnrollments] = useState(true);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as { currentUser: User | null };
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [allCourses, setAllCourses] = useState<any>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any>([]);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        }),
      ),
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const all = await client.fetchAllCourses();
      setAllCourses(all);
      if (!currentUser) return;
      try {
        const enrolled = await client.getEnrolledCoursesForUser(currentUser._id);
        setEnrolledCourses(enrolled);
      } catch {
        setEnrolledCourses([]);
      }
    };
    fetchCourses();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div id="wd-dashboard">
        <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
        <p>
          Please{" "}
          <Link href="/account/signin" className="text-decoration-none">
            sign in
          </Link>{" "}
          to view your courses.
        </p>
      </div>
    );
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <p
        className={`btn ${showingEnrollments ? "btn-primary" : "btn-danger"}`}
        onClick={() => setShowingEnrollments(!showingEnrollments)}
      >
        {showingEnrollments ? "Show all courses" : "Show Enrollments"}
      </p>
      <hr />
      <h5>
        New Course
        <button
          className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={onAddNewCourse}
        >
          {" "}
          Add{" "}
        </button>
        <button
          className="btn btn-warning float-end me-2"
          onClick={onUpdateCourse}
          id="wd-update-course-click"
        >
          Update{" "}
        </button>
      </h5>
      <br />
      <FormControl
        defaultValue={course.name || ""}
        className="mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <FormControl
        defaultValue={course.description || ""}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
      <h2 id="wd-dashboard-published">
        Published Courses (
        {(showingEnrollments ? enrolledCourses : allCourses).length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {(showingEnrollments ? enrolledCourses : allCourses).map(
            (course: any) => (
              <Col
                key={course._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <Link
                    href={`/courses/${course._id}/home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      src="/images/reactjs.jpg"
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle
                        className={`wd-dashboard-course-title text-nowrap overflow-hidden`}
                      >
                        <p style={{ color: course.color }}>
                          {course.name}
                        </p>{" "}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}{" "}
                      </CardText>
                      <Button variant="primary"> Go </Button>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          onDeleteCourse(course._id);
                        }}
                        className="btn btn-danger float-end"
                        id="wd-delete-course-click"
                      >
                        Delete
                      </button>
                      <button
                        id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end"
                      >
                        Edit
                      </button>
                      <button
                        id="wd-enrollments-click"
                        onClick={(event) => {
                          event.preventDefault();
                          const doDrop = enrolledCourses.some(
                            (c: any) => c._id === course._id,
                          );
                          if (doDrop) {
                            client.unenrollFromCourse(
                              currentUser._id,
                              course._id,
                            );
                            setEnrolledCourses(
                              enrolledCourses.filter(
                                (c: any) => c._id !== course._id,
                              ),
                            );
                          } else {
                            client.enrollIntoCourse(
                              currentUser._id,
                              course._id,
                            );
                            setEnrolledCourses([...enrolledCourses, course]);
                          }
                        }}
                        className={`btn me-2 float-end ${
                          enrolledCourses.some((c: any) => c._id === course._id)
                            ? "btn-danger"
                            : "btn-primary"
                        }`}
                      >
                        {enrolledCourses.some((c: any) => c._id === course._id)
                          ? "Drop"
                          : "Enroll"}
                      </button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            ),
          )}
        </Row>
      </div>
    </div>
  );
}

//Old implementation
/* <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1234"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/distributed-system.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CS4750 Distributed Systems </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Systems engineering
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1235"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/syssec.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CY3550 Systems Security </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Security analysis
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1236"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/softeng.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CS4530 Software Engineering </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Software engineer
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1237"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/webdev.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CS4550 Web Development </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1238"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/networks.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CS4700 Network Fundamentals </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Network developer
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1239"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/digitaldesign.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle>
                    {" "}
                    EECE2310 Foundations of Digital Design{" "}
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Computer engineer
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1240"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/systems.jpg"
                  width={200}
                  height={150}
                  alt="reactjs"
                />
                <CardBody>
                  <CardTitle> CS3650 Computer Systems </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Systems engineer
                  </CardText>
                  <Button variant="primary"> Go </Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
} */
