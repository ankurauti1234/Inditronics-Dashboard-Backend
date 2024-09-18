// src/controllers/userController.js
const User = require("../models/userModel");
const nodemailer = require("nodemailer"); // Add nodemailer import

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

exports.getUsers = async (req, res, next) => {
  try {
    const { name, email, employeeId, role, department, designation, company } = req.query;
    
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (employeeId) query.employeeId = { $regex: employeeId, $options: 'i' };
    if (role) query.role = role;
    if (department) query.department = { $regex: department, $options: 'i' };
    if (designation) query.designation = { $regex: designation, $options: 'i' };
    if (company) query.company = { $regex: company, $options: 'i' };

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();

    // Generate a random OTP (for demonstration purposes)
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Send OTP email to the new user
    const otpEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Your OTP code for account verification is: <strong>${otp}</strong></p>
        <p>Please use this code to complete your registration.</p>
      </div>
    `;
    await sendEmail(user.email, "Your OTP Code", otpEmailTemplate); // Send OTP email

    res.status(201).json({ user, otp }); // Optionally return the OTP for further processing
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

