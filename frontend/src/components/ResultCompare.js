import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./css/Result.css";

class ResultCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course_id: this.props.course_id,
      course_code: this.props.course_code,
      course_name: this.props.course_name,
      department: this.props.course_department,
      faculty: this.props.course_faculty,
      description: this.props.course_description,
      pre: this.props.course_pre,
    };
  }

  redirectCourse = () => {
    this.props.history.push(`/course/details/${this.props.course_code}`, {
      course_code: this.props.course_code,
    });
  };

  addCourse = () => {
    if (!this.props.setCourse) return;
    const newCourse = [
      this.state.course_id,
      this.state.course_code,
      this.state.course_name,
      this.state.department,
      this.state.faculty,
      this.state.description,
      this.state.pre,
    ];
    this.props.setCourse(newCourse);
  };

  render() {
    if (this.state.course_code === "NO_PARAMS_ENTERED") {
      return (
        <Container>
          <Row className={"result-display"}>
            <Col>
              <h5>Try entering a search term or applying filter.</h5>
            </Col>
          </Row>
        </Container>
      );
    } else if (this.state.course_code === "NO_RESULTS_FOUND") {
      return (
        <Container>
          <Row className={"result-display"}>
            <Col>
              <h5>No courses found.</h5>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          {/* <a href={`courseDetails/${this.state.course_id}`} onClick={this.redirectCourse} className={"search-result-item"} style={{textDecoration: "none"}}> */}
          <a
            href={`courseDetails/${this.state.course_id}`}
            onClick={this.redirectCourse}
            className={"search-result-item"}
            style={{ textDecoration: "none" }}
          >
            {" "}
          </a>
          <div
            className={"search-result-item"}
            style={{ textDecoration: "none" }}
          >
            <Row className={"result-display"}>
              <Col>
                <h5>{this.state.course_code}</h5>
              </Col>
              <Col>
                <h5>{this.state.course_name}</h5>
              </Col>
              <Col>{this.state.department}</Col>
              <Col>{this.state.faculty}</Col>
              {this.props.setCourse ? (
                <Col>
                  <button
                    style={{ borderRadius: "6px" }}
                    onClick={this.addCourse}
                  >
                    Add
                  </button>
                </Col>
              ) : null}
            </Row>
          </div>
        </Container>
      );
    }
  }
}

export default ResultCompare;
