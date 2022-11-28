import React, { Component } from "react";
import "./css/course-description.css";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import ReactStars from "react-rating-stars-component";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "../axiosInstance/AxiosInstance";
import Spinner from "./Spinner";
import editIcon from "../assets/edit_icon.png";

/*
Course Description Page to view course info, edit course info, or leave a rating out of 5 stars
*/

class CourseDescriptionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      course_code: "",
      course_name: "",
      faculty: "",
      department: "",
      course_description: "",
      syllabus: "",
      prerequisites: "",
      prerequisitesArr: [],
      corequisites: "",
      exclusions: "",
      rating: 0,
      userRating: 0,
      dispSpinner: false,
      dispRating: false,
      currentYear: new Date().getFullYear(),
    };
  }

  componentDidMount() {
    axios
      .get(`/courses/${this.props.match.params.id}`)
      .then((res) => {
        this.setState({ course_code: res.data.Code });
        this.setState({ course_name: res.data.Name });
        this.setState({ course_description: res.data["Course Description"] });
        this.setState({ faculty: res.data.Faculty });
        this.setState({ department: res.data.Department });
        this.setState({ prerequisites: res.data["Pre-requisites"].join(", ") });
        this.setState({ prerequisitesArr: res.data["Pre-requisites"] });
        this.setState({ corequisites: res.data["Corequisite"].join(", ") });
        this.setState({ exclusions: res.data["Exclusion"].join(", ") });
        this.setState({ rating: res.data.Rating });
        this.setState({
          dispRating: !localStorage.getItem(
            `rating-${this.props.match.params.id}`
          ),
        });

        const syllabus_link = (() => {
          if (this.state.course_code.slice(0, 3) !== "ECE") {
            return (
              "https://exams-library-utoronto-ca.myaccess.library.utoronto.ca/simple-search?query=" +
              this.state.course_code
            );
          }

          return "http://courses.skule.ca/search/" + this.state.course_code;
        })();

        this.setState({ syllabus: syllabus_link });
      })
      .catch((err) => {
        console.log("Error");
      });
  }

  saveToTimetableCSV = (courseId, courseCode, courseName, semester, year) => {
    let timetable = JSON.parse(localStorage.getItem("timetable"));
    var missingPrereqs = [];
    var course = {
      course_id: courseId,
      course_code: courseCode,
      course_name: courseName,
      semester: semester,
      year: year,
    };

    if (timetable.some((e) => e.course_id === this.props.match.params.id)) {
      alert("This course is already saved in your timetable!");
    } else {
      this.state.prerequisitesArr.forEach((prereq) => {
        if (
          timetable.some(
            (savedCourse) => savedCourse.course_code === prereq
          ) === false
        ) {
          missingPrereqs.push(prereq);
        }
      });

      if (missingPrereqs.length > 0) {
        var missingPrereqAlert =
          "WARNING: You are missing the following prerequisite(s): " +
          missingPrereqs;
        alert(missingPrereqAlert);
      }

      timetable.push(course);
      localStorage.setItem("timetable", JSON.stringify(timetable));
      window.location.reload();
    }
  };

  openLink = () => {
    const newWindow = window.open(
      this.state.syllabus,
      "_blacnk",
      "noopener,noreferrer"
    );
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  onRatingChange = (rating) => {
    this.setState({ userRating: rating });
  };

  submitUserRating = () => {
    if (!this.state.userRating) return null;
    this.setState({ dispSpinner: true });
    const id = this.props.match.params.id;
    axios
      .patch(`/courses/ratings/${id}`, {
        Rating: this.state.userRating,
      })
      .then((res) => {
        this.setState({ rating: res.data.Rating });
        localStorage.setItem(`rating-${id}`, "true");
        this.setState({ dispRating: false });
        this.setState({ dispSpinner: false });
      })
      .catch(() => {
        this.setState({ dispSpinner: false });
      });
  };

  render() {
    return this.state.dispSpinner ? (
      <Spinner />
    ) : (
      <div className="page-content">
        <Container className="course-template">
          <Row float="center" className="course-title">
            <Col xs={8}>
              <h1>
                {this.state.course_code} : {this.state.course_name}
                {/* Button to link to Edit Course Information page */}
                <a
                    href={`/edit/${this.props.match.params.id}`}
                    state={{ id: this.props.match.params.id }}
                >
                  <img
                    src={editIcon}
                    alt="Edit"
                    className="edit-button" />
                </a>
              </h1>
            </Col>
            {this.state.rating ? (
              <Col>
                <ReactStars
                  edit={false}
                  classNames={"col-name-course-rating"}
                  count={5}
                  activeColor={"#1C3E6E"}
                  size={30}
                  value={this.state.rating}
                />
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col className="col-item">
              <h3>Faculty</h3>
              <p>{this.state.faculty}</p>
            </Col>
            <Col className="col-item">
              <h3>Department</h3>
              <p>{this.state.department}</p>
            </Col>
            <Col className="col-item">
              <h3>Past Tests</h3>
              <button className={"syllabus-link"} onClick={this.openLink}>
                View
              </button>
            </Col>
          </Row>
          <Row>
            <Col className="col-item">
              <h3>Semester</h3>
              <div className="select-wrapper">
                <select
                  ref={(input) => (this.selectSemester = input)}
                  className="select-box"
                >
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
            </Col>
            <Col className="col-item">
              <h3>Year</h3>
              <div className="select-wrapper">
                <select
                  ref={(input) => (this.selectYear = input)}
                  className="select-box"
                >
                  <option value={String(this.state.currentYear)}>
                    {this.state.currentYear}
                  </option>
                  <option value={String(this.state.currentYear + 1)}>
                    {this.state.currentYear + 1}
                  </option>
                  <option value={String(this.state.currentYear + 2)}>
                    {this.state.currentYear + 2}
                  </option>
                  <option value={String(this.state.currentYear + 3)}>
                    {this.state.currentYear + 3}
                  </option>
                  <option value={String(this.state.currentYear + 4)}>
                    {this.state.currentYear + 4}
                  </option>
                </select>
              </div>
            </Col>
            <Col className="col-item">
              <h3>Save Course</h3>
              <button
                data-testid={"add-course-to-timetable-btn"}
                className={"add-course-to-timetable-link"}
                onClick={() =>
                  this.saveToTimetableCSV(
                    this.props.match.params.id,
                    this.state.course_code,
                    this.state.course_name,
                    this.selectSemester.value,
                    this.selectYear.value
                  )
                }
              >
                Add to Timetable
              </button>
            </Col>
          </Row>
          <Row className="col-item course-description">
            <h3>Course Description</h3>
            <p>{this.state.course_description}</p>
          </Row>
          <Row className="col-item course-requisite">
            <Row>
              <h3>Course Requisites</h3>
            </Row>
            <Row>
              <Col className="requisites-display">
                <h4>Pre-Requisites</h4>
                <p>{this.state.prerequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Co-Requisites</h4>
                <p>{this.state.corequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Exclusion</h4>
                <p>{this.state.exclusions}</p>
              </Col>
            </Row>
          </Row>
          {this.state.dispRating ? (
            <Row className="col-item course-requisite">
              <h3>Course Rating</h3>

              <ReactStars
                classNames={"col-ratings"}
                edit={true}
                count={5}
                onChange={this.onRatingChange}
                activeColor={"#1C3E6E"}
                size={40}
                value={this.state.userRating}
              />
              <button className={"rate-button"} onClick={this.submitUserRating}>
                Submit
              </button>
            </Row>
          ) : null}
        </Container>
      </div>
    );
  }
}

export default CourseDescriptionPage;
