// Create User Routes
import express from "express";
import { registerUser, loginUser, changePassword ,forgetPassword, verifyOtp, reset_Password } from "../controllers/UserController.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();


// PUBLIC ROUTES
// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
router.route("/signup").post(registerUser);

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
router.route("/login").post(loginUser);

// PROTECTED ROUTES
// @desc    Change user password
// @route   POST /api/users/change-password
// @access  Private
router.route("/change-password").post(protect, changePassword);


//@ desc forget password
// @route POST /api/users/forgotpassword
// @access Public

router.route("/forgetpassword").post(forgetPassword);

///verify Otp
// @route POST /api/users/verifyotp
// @access Public

router.route("/verifyotp").post(verifyOtp);


// @desc    Reset user password
// @route   POST /api/users/reset-password
// @access  Private
router.route("/resetpassword").post(reset_Password);


export default router;