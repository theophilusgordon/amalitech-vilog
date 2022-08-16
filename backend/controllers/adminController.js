const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const pool = require("../startup/db");

// @desc: Register New Admin
// @route: POST /api/admins
// @access: Public
const registerAdmin = asyncHandler(async (req, res) => {
  const {
    profile_pic,
    first_name,
    last_name,
    email,
    phone,
    company,
    password,
  } = req.body;

  if (!first_name || !last_name || !email || !phone || !company || !password) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Check if admin already exists
  const adminExists = await pool.query(
    "SELECT * FROM admins WHERE email = $1",
    [email]
  );

  if (adminExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create Admin
  const admin = await pool.query(
    "INSERT INTO admins (profile_pic, first_name, last_name, email, phone, company, user_type, password) VALUES($1, $2, $3, $4, $5, $6, 'admin', $7) RETURNING *",
    [profile_pic, first_name, last_name, email, phone, company, hashedPassword]
  );

  if (admin.rowCount !== 0) {
    const result = admin.rows[0];
    res.status(201).json({
      admin_id: result.admin_id,
      profile_pic: result.profile_pic,
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      phone: result.phone,
      user_type: result.user_type,
      token: generateToken(result.admin_id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc: Authenticate An Admin
// @route: POST /api/admin/login
// @access: Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [
    email,
  ]);

  if (
    admin.rowCount !== 0 &&
    (await bcrypt.compare(password, admin.rows[0].password))
  ) {
    const result = admin.rows[0];
    res.status(200).json({
      admin_id: result.admin_id,
      profile_pic: result.profile_pic,
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      phone: result.phone,
      user_type: result.user_type,
      token: generateToken(result.admin_id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// TODO: Correct implementation from here
// @desc: Get Confirmation Code
// @route: GET /api/admins/confirmation-code
// @access: Public
const getConfirmationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required to get confirmation code");
  }

  const adminExists = await pool.query(
    "SELECT * FROM admins WHERE email = $1",
    [email]
  );

  if (adminExists.rowCount === 0) {
    res.status(400);
    throw new Error("Invalid admin email");
  }

  // Generate OTP
  function generateConfirmationCode() {
    let result = "";
    const characters = "0123456789";
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const confirmationCode = generateConfirmationCode();

  // FIXME: Use postgresql syntax
  const postConfirmationCode = await OTP.create({
    otpKey: userOTP,
    author: {
      email,
    },
  });

  // FIXME: Use postgresql syntax
  if (postConfirmationCode) {
    res.status(201).json({
      _id: otp.id,
      author: email,
    });
  } else {
    res.status(500);
    throw new Error("OTP could not be generated. Please try again");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VILOG_EMAIL,
      pass: process.env.VILOG_PASS,
    },
  });

  const mailOptions = {
    from: "amalitech.vilog@gmail.com",
    to: email,
    subject: "AmaliTech ViLog Admin Password Change",
    text: `Use the confirmation code provided in this email to reset your password on AmaliTech ViLog.

    Confirmation Code: ${confirmationCode}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400);
      throw new Error(
        "Confirmation code could not be sent to email. Please try again"
      );
    } else {
      res.status(200).send(`Email sent: ${info.response}`);
    }
  });
});

// @desc: Reset Admin Password
// @route: PUT /api/admins/reset
// @access: Public
const updateAdminPassword = asyncHandler(async (req, res) => {
  const { confirmation_code, password, email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide email one more time to change password");
  }

  if (!confirmation_code) {
    res.status(400);
    throw new Error(
      "Please provide confirmation code sent to your email to change password"
    );
  }

  // FIXME: Use postgresql syntax
  const adminConfirmationCode = await OTP.find({ "author.email": email });
  const confirmationCode =
    adminConfirmationCode[adminConfirmationCode.length - 1].otpKey;

  if (otp !== confirmationCode) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password to update old password");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Change Password
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      password: hashedPassword,
    },
    { new: true }
  );

  if (user) {
    res.status(201).json({
      _id: user.id,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data to reset password");
  }
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getConfirmationCode,
  updateAdminPassword,
};
