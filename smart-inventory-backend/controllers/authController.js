const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { sendResetPasswordEmail } = require("../utils/mailer");
// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const allowedRoles = ["ADMIN", "MANAGER", "STAFF"];
    const assignedRole = role ? role.toUpperCase() : "STAFF";
    if (!allowedRoles.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserId = await userModel.createUser({
      name,
      email,
      hashedPassword,
      role: assignedRole,
    });

    const user = await userModel.findById(newUserId);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT payload contains userId and role
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   return res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Generates 6-digit OTP, stores it, and sends email via Gmail
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      // Do not reveal whether the user exists for security; return standard response
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    // Generate random 6-digit OTP code (e.g. 849201)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB with 15-min expiration
    await userModel.setPasswordResetOtp(email, otp);

    // Send email using Gmail App account
    await sendResetPasswordEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your Gmail account",
    });
  } catch (error) {
    next(error);
  }
};

// 2. POST /api/auth/reset-password
// Verifies OTP from email and saves the new password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Verify OTP and check expiration
    const user = await userModel.verifyResetOtp(email, otp.trim());
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    // Hash new password and clear the OTP fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePasswordWithReset(email, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now login.",
    });
  } catch (error) {
    next(error);
  }
};

// 3. PUT /api/auth/change-password
// Used when a user is already logged in (requires current password verification)
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Retrieve user including current password hash
    const user = await userModel.findById(userId);
    const fullUser = await userModel.findByEmail(user.email);

    const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePasswordById(userId, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};


const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Check if the OTP matches and has not expired
    const user = await userModel.findByOtpAndEmail(email.trim(), otp.trim());

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now proceed to reset your password.",
      data: {
        email: user.email,
        verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  register,
  login,
  getMe,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
};