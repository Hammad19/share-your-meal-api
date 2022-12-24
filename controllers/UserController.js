// Create User Controller
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// @desc    Register a new user
// @route   POST http://localhost:8000/api/users/signup
// @access  Public
export const registerUser = async (req, res) => {
  const {first_name, email, password, confirm_password, accounttype} = req.body;

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
      first_name,
      email,
      password: password_hash,
      accounttype
    });

    // create token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, 
      {
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
          accounttype: user.accounttype,
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
          accounttype: user.accounttype,
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


// @desc forget password
// @route POST /api/users/forgotpassword
// @access Public
// forget password by providing otp to the user
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne ({ email });
        if (user) {

            const otp = Math.floor(10000 + Math.random() * 90000);
            const message = `Your OTP is ${otp}`;
            try {
                await sendEmail({
                    email: user.email,
                    subject: "OTP for password reset",
                    message,
                });
                user.token = otp;
                await user.save();
                res.status(200).json({
                    message: "OTP sent to your email",
                    success: true,
                    email: user.email,
                });
            } catch (error) {
                res.status(500);
                throw new Error("Email could not be sent");
            }
        }
        else {
            res.status(401);
            throw new Error("This Email Does not Exist");
        }
    } catch (error) {
        res.status(400).json({
            status: "failed",
            success: false,
            message: error.message,
        });
    }
};


// send email function to send email by nodemailer
const sendEmail = async (options) => {
  

  console.log(options);

      const transporter = nodemailer.createTransport(


        
        {
        
      

        service: "gmail",

        host: "smtp.gmail.com",

        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASSWORD,
        },




    });

    const mailOptions = {

        
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
  
}

// @desc reset password
// @route PUT /api/users/resetpassword
// @access Public
// reset password by providing otp to the user
export const reset_Password = async (req, res) => {

    const { email, otp, password, confirm_password } = req.body;
    try {
        const user = await User.findOne ({ email });
        //if otp is expired then throw error

            if (user.token == otp) {
                if (password === confirm_password) {
                    const password_salt = await bcrypt.genSalt(10);
                    const password_hash = await bcrypt.hash(password, password_salt);
                    user.password = password_hash;
                    user.confirm_password = password_hash;
                    user.token = undefined;
                    await user.save();
                    res.status(200).json({
                        message: "Password reset success",
                        success: true,
                    });
                }
                else {
                    res.status(401);
                    throw new Error("Password and Confirm Password does not match");
                }
            }
            else {
                res.status(401);
                throw new Error("Invalid OTP");
            }
        }



    catch (error) {

        res.status(400).json({
            status: "failed",
            success: false,
            message: error.message,
        });
    }
};

//verify otp
export const verifyOtp = async (req, res) => {

    const {email, otp } = req.body;
    try {
        const
            user = await User.findOne({ email
            });
        if (user) {
            if (user.token == otp) {
                res.status(200).json({
                    message: "OTP verified",
                    success: true,
                    otp: user.token,
                });
            }
            else {
                res.status(401);
                throw new Error("Invalid OTP");
            }
        }
        else {
            res.status(401);
            throw new Error("This Email Does not Exist");
        } 
    } catch (error) {
        res.status(400).json({
            status: "failed",
            success: false,
            message: error.message,
        });
    }
};

