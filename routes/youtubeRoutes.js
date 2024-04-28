import express from "express";
import { createFreeCourse, deleteFreeCourse, editFreeCourse, getFreeCourses } from "../controllers/youtubeControllers.js";
import { isAuthenticated, isVerifiedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route('/free-course').get(getFreeCourses).post(isAuthenticated, isVerifiedAdmin, singleUpload, createFreeCourse);

router.route('/free-course/:id').put(isAuthenticated, isVerifiedAdmin, singleUpload, editFreeCourse).delete(isAuthenticated, isVerifiedAdmin, deleteFreeCourse);



export default router;