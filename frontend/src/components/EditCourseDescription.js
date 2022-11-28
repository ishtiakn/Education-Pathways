import React, { Component } from "react";
import axios from "../axiosInstance/AxiosInstance";
import Spinner from "./Spinner";
import "./css/edit-course-description.css";
import "bootstrap/dist/css/bootstrap.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

/*
Edit Course Description Page to change any sections about the course info if you have an admin's credentials that is authorized to do so
*/

// removes empty trailing entries with extra commas
const parseArr = (value) => {
  let arr =
    value.replace(/\s/g, "") === "" ? [] : value.replace(/\s/g, "").split(",");
  if (arr.length > 0) {
    while (arr[arr.length - 1] === "") arr.pop();
  }
  return arr;
};

class EditCourseDesc extends Component {
  constructor(props) {
    super(props);
    // initialize object
    this.state = {
      course_code: "",
      course_name: "",
      course_description: "",
      faculty: "",
      department: "",
      prerequisites: [],
      corequisites: [],
      exclusions: [],
      dispSpinner: false,
      editDone: false,
    };
  }

  componentDidMount() {
    // fetch pertinent course info from database
    axios.get(`courses/${this.props.match.params.id}`).then((res) => {
      this.setState({ course_code: res.data.Code });
      this.setState({ course_name: res.data.Name });
      this.setState({ course_description: res.data["Course Description"] });
      this.setState({ faculty: res.data.Faculty });
      this.setState({ department: res.data.Department });
      this.setState({ prerequisites: res.data["Pre-requisites"] });
      this.setState({ corequisites: res.data["Corequisite"] });
      this.setState({ exclusions: res.data["Exclusion"] });
    });
  }

  // stall and wait to see if credentials are correct (async/await)
  // if yes, update database with current fields
  onSubmit = async (event) => {
    // stalling spinner
    this.setState({ dispSpinner: true });
    try {
      // authetication
      const res = await axios.post("/users/login", {
        email: event.target.username.value,
        password: event.target.password.value,
      });
      const { token } = res.data;
      //localStorage.setItem("access_token", token);
      
      // remove trailing entries in these 3 fields
      const pre_requisite = parseArr(event.target.prerequisites.value);
      const co_requisite = parseArr(event.target.corequisites.value);
      const exclusion = parseArr(event.target.exclusions.value);

      // patch database changes
      await axios.patch(
        `courses/${this.props.match.params.id}`,
        {
          "Course Description": event.target.description.value,
          Code: event.target.code.value,
          Name: event.target.name.value,
          Faculty: event.target.faculty.value,
          Department: event.target.department.value,
          "Pre-requisites": pre_requisite,
          Corequisite: co_requisite,
          Exclusion: exclusion,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      this.setState({ editDone: true });
    } catch (err) {
      // authentication error, do not refresh if user would like to re-enter credentials
      event.preventDefault();
      event.target.password.value = "";
      alert(
        "Unable to update course. Please confirm that the admin credentials are correct."
      );
    }
    this.setState({ dispSpinner: false });
  };

  render() {
    // ternary operator to redirect user to course page, spinner, or show edit course information page
    return this.state.editDone ? (
      <Redirect to={`/courseDetails/${this.props.match.params.id}`} />
    ) : this.state.dispSpinner ? (
      <Spinner />
    ) : (
      <div>
        {/* back button */}
        <form action={`/courseDetails/${this.props.match.params.id}`}>
          <input type="submit" value="Back" id={"form-back-button"} className={"syllabus-link"} />
        </form>
        {/* title */}
        <h1 style={{ marginBottom: "2.5%" }}>
          {this.state.course_code}: {this.state.course_name}
        </h1>
        {/* Forms and Fields with current data filled out for user to edit however they like */}
        <form className="form" onSubmit={this.onSubmit}>
          <label className="form-field-label">Admin Username</label>
          <input
            type="text"
            id="username"
            placeholder="Admin Email"
            className="text-input form-field"
          />
          <label className="form-field-label">Admin Password</label>
          <input
            type="password"
            id="password"
            className="text-input form-field"
          />
          <p>Admin credentials required to update.</p>
          <hr className="section-divider"></hr>
          <br></br>
          <label className="form-field-label">Course Code</label>
          <input
            type="text"
            id="code"
            defaultValue={this.state.course_code}
            className="text-input form-field"
          />
          <label className="form-field-label">Course Name</label>
          <input
            type="text"
            id="name"
            defaultValue={this.state.course_name}
            className="text-input form-field"
          />
          <label className="form-field-label">Course Description</label>
          <textarea
            rows="10"
            cols="100"
            type="text"
            id="description"
            defaultValue={this.state.course_description}
            className="text-input form-field"
          />
          <label className="form-field-label">Faculty</label>
          <input
            type="text"
            id="faculty"
            defaultValue={this.state.faculty}
            className="text-input form-field"
          />
          <label className="form-field-label">Department</label>
          <input
            type="text"
            id="department"
            defaultValue={this.state.department}
            className="text-input form-field"
          />
          <h1 style={{ margin: "2%" }} className="form-field-label-underlined">
            &nbsp;Course Requisites&nbsp;
          </h1>
          <p>Please enter requisite course codes, seperated by commas.</p>
          <p>Ex. ABC123H1, ABC456H1</p>
          <br></br>
          <label className="form-field-label">Pre-Requisites</label>
          <input
            type="text"
            id="prerequisites"
            defaultValue={this.state.prerequisites}
            className="text-input form-field"
          />
          <label className="form-field-label">Co-Requisites</label>
          <input
            type="text"
            id="corequisites"
            defaultValue={this.state.corequisites}
            className="text-input form-field"
          />
          <label className="form-field-label">Exclusions</label>
          <input
            type="text"
            id="exclusions"
            defaultValue={this.state.exclusions}
            className="text-input form-field"
          />
          <input type="submit" value="Update" className="syllabus-link" />
        </form>
      </div>
    );
  }
}

export default EditCourseDesc;
