import express from "express";
import { addLectureToFreeCourse, createFreeCourse, deleteFreeCourse, editFreeCourse, editSpecificCourseLecture, getFreeCourses, getSpecificFreeCourse } from "../controllers/youtubeControllers.js";
import { isAuthenticated, isVerifiedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route('/free-course').get(getFreeCourses).post(isAuthenticated, isVerifiedAdmin, singleUpload, createFreeCourse);

router.route('/free-course/:id').get(getSpecificFreeCourse).post(isAuthenticated, isVerifiedAdmin, addLectureToFreeCourse).put(isAuthenticated, isVerifiedAdmin, singleUpload, editFreeCourse).delete(isAuthenticated, isVerifiedAdmin, deleteFreeCourse);

router.route('/free-course/:id/:lectureid').put(isAuthenticated, isVerifiedAdmin, editSpecificCourseLecture);



export default router;