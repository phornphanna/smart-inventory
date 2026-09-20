const db = require("../config/db");

// Find a user by email (including password hash for verification)
const findByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT id, name, email, password, role, isActive, createdAt, updatedAt 
     FROM users 
     WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
};

// Find a user by ID (excluding password)
const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, role, isActive, createdAt, updatedAt 
     FROM users 
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

// Create a new user
const createUser = async ({ name, email, hashedPassword, role }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, role) 
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role || "STAFF"]
  );
  return result.insertId;
};

// Add these functions into models/userModel.js

// 1. Save OTP and expiration (15 minutes ahead)
const setPasswordResetOtp = async (email, otp) => {
  await db.query(
    `UPDATE users 
     SET resetPasswordOtp = ?, 
         resetPasswordExpires = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)
     WHERE email = ?`,
    [otp, email]
  );
};

// 2. Find user matching email, OTP, and check expiration
const verifyResetOtp = async (email, otp) => {
  const [rows] = await db.query(
    `SELECT id, name, email 
     FROM users 
     WHERE email = ? 
       AND resetPasswordOtp = ? 
       AND resetPasswordExpires > CURRENT_TIMESTAMP`,
    [email, otp]
  );
  return rows[0] || null;
};

// 3. Update password and clear OTP
const updatePasswordWithReset = async (email, newHashedPassword) => {
  await db.query(
    `UPDATE users 
     SET password = ?, 
         resetPasswordOtp = NULL, 
         resetPasswordExpires = NULL 
     WHERE email = ?`,
    [newHashedPassword, email]
  );
};

// 4. Update password directly by User ID (for logged-in change password)
const updatePasswordById = async (id, newHashedPassword) => {
  await db.query("UPDATE users SET password = ? WHERE id = ?", [
    newHashedPassword,
    id,
  ]);
};


const findByOtpAndEmail = async (email, otp) => {
  const [rows] = await db.query(
    `SELECT id, name, email, resetPasswordOtp, resetPasswordExpires
     FROM users
     WHERE email = ? 
       AND resetPasswordOtp = ? 
       AND resetPasswordExpires > CURRENT_TIMESTAMP`,
    [email, otp]
  );
  return rows[0] || null;
};

// Export along with other functions in userModel.js
module.exports = {
  findByEmail,
  findById,
  createUser,
  setPasswordResetOtp,
  verifyResetOtp,
  findByOtpAndEmail,
  updatePasswordWithReset,
  updatePasswordById,
};

