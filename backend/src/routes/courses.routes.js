/*
 * Define all CRUD routes on courses endpoint
 * Certain routes are protected by auth middleware
 * This prevents non admin users from modifying the courses database
 */

const express = require("express");
const auth = require("../middleware/auth.middleware.js");
const courseController = require("../controllers/courses.controller");

const router = new express.Router();

/* Free Endpoints */
router.get("/courses", courseController.getAllCourses);
router.get("/courses/departments", courseController.getCourseDepartments);
router.get("/courses/faculties", courseController.getCourseFaculties);
router.get("/courses/campuses", courseController.getCourseCampuses);
router.get("/courses/:id", courseController.getCourseById);
router.patch("/courses/ratings/:id", courseController.updateCourseRating);

/* Protected Endpoints */
router.post("/courses", auth, courseController.addCourse);
router.patch("/courses/:id", auth, courseController.updateCourse);
router.delete("/courses/:id", auth, courseController.deleteCourse);

module.exports = router;
