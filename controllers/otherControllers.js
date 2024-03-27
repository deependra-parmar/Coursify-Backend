import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import { InstructorStats } from "../models/InstructorStats.js";
import { Payment } from "../models/Payment.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendMail.js";


export const contact = catchAsyncError( async(req,res,next) => {
    const {name, email, message} = req.body;

    if(!name || !email || !message){
        return next(new ErrorHandler("All fields are required", 400));
    }

    const to = process.env.MY_MAIL;
    const subject = "Contact from Coursify";
    const text = `Hello, I am ${name}, my email is ${email}. ${message}`

    await sendEmail(to,subject,text);

    res.status(200).json({
        success: true,
        message: "We got your message and we'll get in touch with you asap"
    });
});

export const getPublicProfile = catchAsyncError( async(req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("Public Profile Not Found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
})


// controller for getting the stats for the instructor 
export const getInstructorStats = catchAsyncError(async (req, res, next) => {
    const instructor = await User.findById(req.user._id);
    const stats = await InstructorStats.find({ instructorId: instructor._id })
        .sort({ createdAt: "desc" })
        .limit(12);


    const statsData = stats.map((stat) => ({
        totalCourses: stat.metrics[0].totalCourses,
        totalStudentsEnrolled: stat.metrics[0].totalStudentsEnrolled,
        views: stat.metrics[0].views,
        totalEarnings: stat.metrics[0].totalEarnings,
    }));

    const reqSize = 12 - stats.length;

    for (let i = 0; i < reqSize; i++) {
        statsData.unshift({
            totalCourses: 0,
            totalStudentsEnrolled: 0,
            views: 0,
            totalEarnings: 0,
        });
    }

    let userCount = statsData[11].totalStudentsEnrolled;
    let courseCount = statsData[11].totalCourses;
    let viewCount = statsData[11].views;
    let earningCount = statsData[11].totalEarnings;

    let userProfit = true, viewProfit = true, earningProfit = true;
    let userPercent = 0, viewPercent = 0, earningPercent = 0;

    if (statsData[10].totalStudentsEnrolled === 0) {
        userPercent = userCount * 100;
    } else {
        const difference = userCount - statsData[10].totalStudentsEnrolled;
        userPercent = (difference / statsData[10].totalStudentsEnrolled) * 100;
        if (userPercent < 0) userProfit = false;
    }

    if (statsData[10].views === 0) {
        viewPercent = viewCount * 100;
    } else {
        const difference = viewCount - statsData[10].views;
        viewPercent = (difference / statsData[10].views) * 100;
        if (viewPercent < 0) viewProfit = false;
    }

    if (statsData[10].totalEarnings === 0) {
        earningPercent = earningCount * 100;
    } else {
        const difference = earningCount - statsData[10].totalEarnings;
        earningPercent = (difference / statsData[10].totalEarnings) * 100;
        if (earningPercent < 0) earningProfit = false;
    }

    

    res.status(200).json({
        success: true,
        stats: statsData,
        userCount,
        courseCount,
        viewCount,
        earningCount,
        userProfit,
        viewProfit,
        earningProfit,
        userPercent,
        viewPercent,
        earningPercent,
    });
});


// getting the admin's users list
export const getUserForAdminDashboard = catchAsyncError(async (req, res, next) => {
    const users = await User.find().select(['_id', 'name', 'email', 'avatar']);

    if (!users) {
        return next(new ErrorHandler("No Users found", 404));
    }

    res.status(200).json({
        success: true,
        users
    })
});

// getting the admin's users list
export const getInstructorForAdminDashboard = catchAsyncError(async (req, res, next) => {
    const instructors = await User.find({ isVerifiedInstructor: true }).select(['_id', 'name', 'email', 'avatar']);

    if (!instructors) {
        return next(new ErrorHandler("No Instructors found", 404));
    }

    res.status(200).json({
        success: true,
        instructors
    })
});

// getting the courses on admin dashboard 
export const getCoursesForAdminDashboard = catchAsyncError( async(req, res, next) => {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const courses = await Course.find({
        title: {
            $regex: keyword,
            $options: "i"
        },
        category: {
            $regex: category,
            $options: "i"
        }
    });

    if(!courses){
        return next(new ErrorHandler("No Courses Found", 404));
    }

    res.status(200).json({
        success: true,
        courses
    })
});

export const getTransactionsForAdminDashboard = catchAsyncError(async (req, res, next) => {
    const transactions = await Payment.find({}).select(['razorpay_payment_id','transaction_date','transaction_amount','user','course']);

    if(!transactions){
        return next(new ErrorHandler("No Transactions Found", 404));
    }

    res.status(200).json({
        success: true,
        transactions
    })
});