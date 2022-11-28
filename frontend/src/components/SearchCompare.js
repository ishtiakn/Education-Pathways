import React, { Component } from "react";
import axios from "../axiosInstance/AxiosInstance";
import Spinner from "./Spinner";
import "./css/Result.css";
import Label from "./Label";
import "./css/styles.css";
import ResultCompare from "./ResultCompare";

//Returns an array of unique values for the given database attribute, s
async function getDropdownValues(s) {
  let dropdownValues = [];
  try {
    let res = await axios.get("/courses/".concat(s));
    dropdownValues = res.data;
  } catch (error) {
    dropdownValues = ["Error. Failed to retrieve dropdown values"];
  }
  return dropdownValues;
}

// Returns An array of dictionaries for numerical dropdown values  Used for
// minLevel and maxLevel dropdowns
function arrayDictNumbers(minVal, maxVal) {
  let arr_dict = [];
  for (var i = minVal; i <= maxVal; i++) {
    arr_dict.push({ value: i.toString(), text: i.toString() });
  }
  return arr_dict;
}

// The primary component of this file. Allows users to search, filter, and
// access results
class SearchBarCompare extends Component {
  constructor() {
    super();
    this.state = {
      //Dropdown values
      faculties: [],
      departments: [],
      //Query params
      input: "",
      faculty: "",
      department: "",
      minLevel: "none",
      maxLevel: "none",
      //Show loading animation when True
      dispSpinner: false,
      //Query results
      results: [],
    };
  }

  // Get  drodown values from DB before rendering page
  async componentDidMount() {
    this.setState({ dispSpinner: true });

    //Need array of dictionaries to populate dropdown calues
    let arr = await getDropdownValues("faculties");
    let arr_dict = [];
    for (var i = 0; i < arr.length; i++) {
      arr_dict.push({ value: arr[i], text: arr[i] });
    }
    this.setState({ faculties: arr_dict });
    arr = await getDropdownValues("departments");
    arr_dict = [];
    for (i = 0; i < arr.length; i++) {
      arr_dict.push({ value: arr[i], text: arr[i] });
    }
    this.setState({ departments: arr_dict });

    this.setState({ dispSpinner: false });
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      [event.target.name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.getData();
  };

  getData = () => {
    this.setState({ dispSpinner: true });
    //Construct the API Get Request from search term and filters
    let getRequestURL = "/courses?search=";
    if (this.state.input !== "") {
      getRequestURL = getRequestURL.concat(
        this.state.input
          .replaceAll("&", "%26")
          .replaceAll("/", "%2F")
          .replaceAll("=", "%3D")
          .replaceAll("?", "%3F")
      );
    }
    if (this.state.faculty !== "") {
      getRequestURL = getRequestURL
        .concat("&faculty=")
        .concat(
          this.state.faculty
            .replaceAll("&", "%26")
            .replaceAll("/", "%2F")
            .replaceAll("=", "%3D")
            .replaceAll("?", "%3F")
        );
    }
    if (this.state.department !== "") {
      getRequestURL = getRequestURL
        .concat("&department=")
        .concat(
          this.state.department
            .replaceAll("&", "%26")
            .replaceAll("/", "%2F")
            .replaceAll("=", "%3D")
            .replaceAll("?", "%3F")
        );
    }
    if (this.state.minLevel !== "none") {
      getRequestURL = getRequestURL
        .concat("&minLevel=")
        .concat(this.state.minLevel);
    }
    if (this.state.maxLevel !== "none") {
      getRequestURL = getRequestURL
        .concat("&maxLevel=")
        .concat(this.state.maxLevel);
    }

    //Do not call API if user enters no params
    if (getRequestURL === "/courses?search=") {
      let result_temp = [];
      result_temp.push(
        <ResultCompare
          key={""}
          course_id={""}
          course_code={"NO_PARAMS_ENTERED"}
          course_name={""}
          course_faculty={""}
          course_department={""}
        ></ResultCompare>
      );
      this.setState({ results: result_temp });
      this.setState({ dispSpinner: false });
    }
    //Call API with the get request
    else {
      axios
        .get(getRequestURL)
        .then((res) => {
          if (res.status === 200) {
            this.setState({ results: [] });
            console.log(res.data);
            if (res.data.length > 0) {
              let len = res.data.length;
              let result_temp = [];
              result_temp.push(<Label></Label>);
              for (let i = 0; i < len; i++) {
                result_temp.push(
                  <ResultCompare
                    key={res.data[i]._id}
                    course_id={res.data[i]._id}
                    course_code={res.data[i].Code}
                    course_name={res.data[i].Name}
                    course_faculty={res.data[i].Faculty}
                    course_department={res.data[i].Department}
                    course_description={res.data[i]["Course Description"]}
                    course_pre={res.data[i]["Pre-requisites"]}
                    setCourse={this.props.setCourse}
                  ></ResultCompare>
                );
              }
              this.setState({ results: result_temp });
            } else {
              alert("Course not found");
            }
          } else if (res.status === 500) {
            alert("System Error. Please refresh");
          }
          this.setState({ dispSpinner: false });
        })
        .catch(() => {
          let result_temp = [];
          result_temp.push(
            <ResultCompare
              key={1}
              course_id={""}
              course_code={"No results found."}
              course_name={""}
              course_faculty={""}
              course_department={""}
            ></ResultCompare>
          );
          this.setState({ results: result_temp });
          this.setState({ dispSpinner: false });
        });
    }
  };

  render() {
    return this.state.dispSpinner ? (
      <Spinner />
    ) : (
      <div className="SearchQuery">
        <div>
          <form onSubmit={this.handleSubmit} className={"search"}>
            <input
              placeholder={"Enter a course code, title, keyword..."}
              className={"text-input"}
              type="text"
              name="input"
              value={this.state.input}
              onChange={this.handleChange}
            />
            <input type="submit" value="Search" className={"submit-button"} />
            <br></br>
            <br></br>
            <label for="faculty">Faculty:</label>
            <select
              name="faculty"
              onChange={this.handleChange}
              value={this.state.faculty}
              className={"dropdown"}
              id="faculty"
            >
              <option value="" className={"dropdown"} selected="selected">
                any
              </option>
              {this.state.faculties.map((option, index) => (
                <option key={index} value={option.value} className={"dropdown"}>
                  {option.text}
                </option>
              ))}
            </select>
            <br></br>
            <br></br>
            <label for="department">Department:</label>
            <select
              name="department"
              onChange={this.handleChange}
              value={this.state.department}
              className={"dropdown"}
              id="department"
            >
              <option value="" className={"dropdown"} selected="selected">
                any
              </option>
              {this.state.departments.map((option, index) => (
                <option key={index} value={option.value} className={"dropdown"}>
                  {option.text}
                </option>
              ))}
            </select>
            <br></br>
            <br></br>
            <label for="minLevel">Min. Level:</label>
            <select
              name="minLevel"
              onChange={this.handleChange}
              value={this.state.minLevel}
              className={"dropdown"}
              id="minLevel"
            >
              <option value="none" className={"dropdown"} selected="selected">
                none
              </option>
              {arrayDictNumbers(0, 7).map((option, index) => (
                <option key={index} value={option.value} className={"dropdown"}>
                  {option.text}
                </option>
              ))}
            </select>
            <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
            <label for="maxLevel">Max. Level:</label>
            <select
              name="maxLevel"
              onChange={this.handleChange}
              value={this.state.maxLevel}
              className={"dropdown"}
              id="maxLevel"
            >
              <option value="none" className={"dropdown"} selected="selected">
                none
              </option>
              {arrayDictNumbers(0, 7).map((option, index) => (
                <option key={index} value={option.value} className={"dropdown"}>
                  {option.text}
                </option>
              ))}
            </select>
          </form>
        </div>
        <div className={"search-result-display"}>{this.state.results}</div>
      </div>
    );
  }
}

export default SearchBarCompare;
