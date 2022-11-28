/*
 * Define the structure of course data in the database
 */

const mongoose = require("mongoose");

const Course = mongoose.model("Course", {
  Code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Faculty: {
    type: String,
    required: true,
    trim: true,
  },
  Department: {
    type: String,
    required: true,
    trim: true,
  },
  Rating: {
    type: Number,
    min: 0,
    default: 0,
    max: 5,
  },
  RatingNum: {
    type: Number,
    min: 0,
    default: 0,
  },
  "Course Description": {
    type: String,
    required: true,
    trim: true,
  },
  "Pre-requisites": {
    type: Array,
    default: [],
  },
  "Course Level": {
    type: Number,
    required: true,
    min: 0,
  },
  Campus: {
    type: String,
    required: true,
  },
  Term: {
    type: Array,
    required: true,
    validate(data) {
      if (data.length < 1) {
        throw new Error("Course must be offered in atleast one term");
      }
    },
  },
  Exclusion: {
    type: Array,
    default: [],
  },
  Corequisite: {
    type: Array,
    default: [],
  },
  "Recommended Preparation": {
    type: Array,
    default: [],
  },
  MajorsOutcomes: {
    type: Array,
    default: [],
  },
  MinorsOutcomes: {
    type: Array,
    default: [],
  },
});

module.exports = Course;
