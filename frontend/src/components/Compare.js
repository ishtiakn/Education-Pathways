import React, { Component } from "react";
import "./css/Compare.css";
import SearchBarCompare from "./SearchCompare";
import "./css/Result.css";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course1: [],
      course2: [],
    };
  }
  syllabus_link = (course) => {
    if (typeof course !== "string") {
      console.log("not string!");
      return;
    } else if (course.slice(0, 3) !== "ECE") {
      return (
        "https://exams-library-utoronto-ca.myaccess.library.utoronto.ca/simple-search?query=" +
        course
      );
    }

    return "http://courses.skule.ca/search/" + course;
  };
  openLink = (course) => {
    const newWindow = window.open(
      this.syllabus_link(course),
      "_blacnk",
      "noopener,noreferrer"
    );
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  setCourse = (newCourse) => {
    if (this.state.course1.length === 0) {
      this.setState({ course1: newCourse });
    } else {
      this.setState({ course2: newCourse });
    }
  };
  render() {
    return (
      <div>
        <div className="compare_container">
          <div className="right_container">
            <button
              className="close"
              onClick={() => {
                this.setState({ course1: [] });
              }}
            >
              X
            </button>

            <div className="compare_Code">{this.state.course1[1]}</div>
            <div className="compare_line">{this.state.course1[2]}</div>
            <div className="compare_line">
              {this.state.course1.length === 0 ? (
                <h3>To be added</h3>
              ) : (
                this.state.course1[3]
              )}
            </div>
            <div className="compare_line">{this.state.course1[4]}</div>

            <div className="compare_line">
              {/* prereq */}
              {this.state.course1.length === 0
                ? null
                : "Pre-requisites: " + this.state.course1[6]}
            </div>

            <div className="description">{this.state.course1[5]}</div>

            <div className="compare_line">
              {this.state.course1.length === 0 ? null : (
                <button
                  style={{ borderRadius: "6px" }}
                  onClick={() => {
                    this.openLink(this.state.course1[1]);
                  }}
                >
                  Past Tests
                </button>
              )}
            </div>
          </div>
          <div className="left_container">
            <button
              className="close"
              onClick={() => {
                this.setState({ course2: [] });
              }}
            >
              X
            </button>

            <div className="compare_Code">{this.state.course2[1]}</div>
            <div className="compare_line">{this.state.course2[2]}</div>
            <div className="compare_line">
              {this.state.course2.length === 0 ? (
                <h3>To be added</h3>
              ) : (
                this.state.course2[3]
              )}
            </div>
            <div className="compare_line">{this.state.course2[4]}</div>

            <div className="compare_line">
              {/* prereq */}
              {this.state.course2.length === 0
                ? null
                : "Pre-requisites: " + this.state.course2[6]}
            </div>

            <div className="description">{this.state.course2[5]}</div>
            <div className="compare_line">
              {this.state.course2.length === 0 ? null : (
                <button
                  style={{ borderRadius: "6px" }}
                  onClick={() => {
                    this.openLink(this.state.course2[1]);
                  }}
                >
                  Past Tests
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="search_container">
          <SearchBarCompare setCourse={this.setCourse} />
        </div>
      </div>
    );
  }
}

export default Compare;
