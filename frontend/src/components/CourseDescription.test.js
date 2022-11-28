import { render, rerender, fireEvent, screen } from "@testing-library/react";
import CourseDescriptionPage from "./CourseDescription";
import * as React from "react";

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

delete window.location;
window.location = { reload: jest.fn() };

// (Gaurav Ranganath LAB 6 TDD) 
test("Tests adding course to timetable", () => {
  const props = {
    match: {
      params: {
        id: 0,
      },
    },
  };

  localStorage.setItem("timetable", JSON.stringify([]));

  render(<CourseDescriptionPage {...props} />);

  const addCourseToTimetableBtn = screen.getByTestId(
    "add-course-to-timetable-btn"
  );

  fireEvent.click(addCourseToTimetableBtn);

  expect(JSON.parse(localStorage.getItem("timetable"))).toStrictEqual([
    {
      course_code: "",
      course_id: 0,
      course_name: "",
      semester: "Fall",
      year: "2022",
    },
  ]);
});

// (Gaurav Ranganath LAB 6 TDD) 
test("Tests adding a duplicate course to timetable", () => {
  const props = {
    match: {
      params: {
        id: 0,
      },
    },
  };

  localStorage.setItem("timetable", JSON.stringify([]));

  render(<CourseDescriptionPage {...props} />);

  const addCourseToTimetableBtn = screen.getByTestId(
    "add-course-to-timetable-btn"
  );

  fireEvent.click(addCourseToTimetableBtn);
  fireEvent.click(addCourseToTimetableBtn);

  expect(JSON.parse(localStorage.getItem("timetable"))).toStrictEqual([
    {
      course_code: "",
      course_id: 0,
      course_name: "",
      semester: "Fall",
      year: "2022",
    },
  ]);
});

// (Gaurav Ranganath LAB 6 TDD) 
test("Tests adding multiple courses to timetable", () => {
  var props = {
    match: {
      params: {
        id: 0,
      },
    },
  };

  localStorage.setItem("timetable", JSON.stringify([]));

  const { rerender } = render(<CourseDescriptionPage {...props} />);

  const addCourseToTimetableBtn = screen.getByTestId(
    "add-course-to-timetable-btn"
  );

  fireEvent.click(addCourseToTimetableBtn);

  props.match.params.id = 1;

  rerender(<CourseDescriptionPage {...props} />);

  fireEvent.click(addCourseToTimetableBtn);

  expect(JSON.parse(localStorage.getItem("timetable"))).toStrictEqual([
    {
      course_code: "",
      course_id: 0,
      course_name: "",
      semester: "Fall",
      year: "2022",
    },
    {
      course_code: "",
      course_id: 1,
      course_name: "",
      semester: "Fall",
      year: "2022",
    },
  ]);
});
