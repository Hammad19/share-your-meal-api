// Create User Controller
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST http://localhost:8000/api/users/signup
// @access  Public
export const registerUser = async (req, res) => {
  const { email, password, confirm_password } = req.body;

  try {
    // check if confirm password matches password else throw error

    if (password !== confirm_password) {
      throw new Error("Passwords do not match");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // create password hash for the user
    const password_salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, password_salt);

    const user = await User.create({
      email,
      password: password_hash,
    });

    // create token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

    if (user) {
      res.status(200).json({
        message: "User created successfully",
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create token for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      success: false,
      message: error.message,
    });
  }
};

// @desc    forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
    
        if (user) {
        // create token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    
        // send email to user
        const resetUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/users/resetpassword/${token}`;
    
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    
        try {
            await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message,
            });
    
            res.status(200).json({
            message: "Email sent",
            success: true,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
    
            await user.save({ validateBeforeSave: false });
    
            res.status(500);
            throw new Error("Email could not be sent");
        }
        } else {
        res.status(401);
        throw new Error("Invalid email");
        }
    } catch (error) {
        res.status(400).json({
        status: "failed",
        success: false,
        message: error.message,
        });
    }
};

// @desc    reset password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
    const { password, confirm_password } = req.body;

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

    try {
        // Check if user exists
        const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
        });

        if (user) {
        // set new password
        user.password = req.body.password;
        user.confirm_password = req.body.confirm_password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // create password hash for the user
        const password_salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(user.password, password_salt);

        user.password = password_hash;

        await user.save();

        res.status(200).json({
            message: "Password reset success",
            success: true,
        });
        } else {
        res.status(401);
        throw new Error("Invalid token");
        }
    } catch (error) {
        res.status(400).json({
        status: "failed",
        success: false,
        message: error.message,
        });
    }
};

// @desc    change password
// @route   PUT /api/users/changepassword
// @access  Private
export const changePassword = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;

    try {
        // Check if password matches else throw error
        if (confirm_password !== new_password) {
            throw new Error("Passwords do not match");
        }

        // Check if user exists
        const user = await User.findById(req.user.id).select("+password");

        if (user && (await bcrypt.compare(current_password, user.password))) {
        // set new password
        user.password = new_password;
        user.confirm_password = confirm_password;

        // create password hash for the user
        const password_salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(user.password, password_salt);

        user.password = password_hash;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
            success: true,
        });
        } else {
        res.status(401);
        throw new Error("Invalid current password");
        }
    } catch (error) {
        res.status(400).json({
        status: "failed",
        success: false,
        message: error.message,
        });
    }
};