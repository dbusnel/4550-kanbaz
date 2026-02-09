import Link from "next/link";
import Image from "next/image";
import {
  Row,
  Col,
  CardImg,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
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
}
