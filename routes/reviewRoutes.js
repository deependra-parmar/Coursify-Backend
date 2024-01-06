import express from "express";
import { isAuthenticated, isVerifiedAdmin } from "../middlewares/auth.js";
import { approveInstructorRequest, discardInstructorRequest, getReviewRequests } from "../controllers/reviewController.js";

const router = express.Router();

// for getting the review requests on the admin panel
router.route("/fetch-review-requests").get(isAuthenticated, isVerifiedAdmin, getReviewRequests);

// for approving the review request submitted by the instructor
router.route("/approve-instructor-request/:id").put(isAuthenticated, isVerifiedAdmin, approveInstructorRequest);
router.route("/discard-instructor-request/:id").put(isAuthenticated, isVerifiedAdmin, discardInstructorRequest);



export default router;