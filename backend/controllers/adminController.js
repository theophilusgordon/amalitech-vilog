const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const pool = require("../startup/db");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

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
    "SELECT * FROM admins WHERE admin_email = $1",
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
    "INSERT INTO admins (admin_uuid, admin_profile_pic, admin_first_name, admin_last_name, admin_email, admin_phone, admin_company, admin_password) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING admin_uuid, admin_profile_pic, admin_first_name, admin_last_name, admin_email, admin_phone, admin_company",
    [
      uuidv4(),
      profile_pic,
      first_name,
      last_name,
      email,
      phone,
      company,
      hashedPassword,
    ]
  );

  if (admin.rowCount !== 0) {
    const result = admin.rows[0];
    res.status(201).json({
      admin_id: result.admin_id,
      profile_pic: result.admin_profile_pic,
      name: `${result.admin_first_name} ${result.admin_last_name}`,
      email: result.admin_email,
      phone: result.admin_phone,
      token: generateToken(result.admin_uuid),
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

  const admin = await pool.query(
    "SELECT * FROM admins WHERE admin_email = $1",
    [email]
  );

  if (
    admin.rowCount !== 0 &&
    (await bcrypt.compare(password, admin.rows[0].admin_password))
  ) {
    const result = admin.rows[0];
    res.status(200).json({
      admin_id: result.admin_id,
      profile_pic: result.admin_profile_pic,
      name: `${result.admin_first_name} ${result.admin_last_name}`,
      email: result.admin_email,
      phone: result.admin_phone,
      token: generateToken(result.admin_uuid),
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

// @desc: Get Confirmation Code
// @route: POST /api/admins/confirmation-code
// @access: Public
const getConfirmationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required to get confirmation code");
  }

  const adminExists = await pool.query(
    "SELECT * FROM admins WHERE admin_email = $1",
    [email]
  );

  if (adminExists.rowCount === 0) {
    res.status(400);
    throw new Error("Invalid admin email");
  }

  // Generate Confirmation Code
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

  const confirmationCodeUUID = uuidv4();

  const postConfirmationCode = await pool.query(
    "INSERT INTO confirmation_code (confirmation_code_uuid, code) VALUES ($1, $2)",
    [confirmationCodeUUID, confirmationCode]
  );
  
  await pool.query(
    "UPDATE admins SET admin_confirmation_code_id = $1 WHERE admin_email = $2", [confirmationCodeUUID, email]
  );

  if (postConfirmationCode.rowCount !== 0) {
    res.status(201).json(postConfirmationCode.rows[0]);
  } else {
    res.status(500);
    throw new Error("Confirmation code could not be generated. Please try again");
  }

  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.VILOG_EMAIL,
      pass: process.env.VILOG_PASS,
    },
  });

  const mailOptions = {
    from: process.env.VILOG_EMAIL,
    to: email,
    subject: "AmaliTech ViLog Admin Password Change",
    text: `Use the confirmation code provided in this email to reset your password on AmaliTech ViLog.

    Confirmation Code: ${confirmationCode}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400);
      console.log(error);
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

  const adminConfirmationCode = await pool.query("SELECT code FROM confirmation_code LEFT JOIN admins ON confirmation_code_uuid = admins.admin_confirmation_code_id");

  if (
    confirmation_code !==
    adminConfirmationCode.rows[adminConfirmationCode.rowCount - 1].code
  ) {
    res.status(400);
    throw new Error("Invalid Confirmation Code");
  }

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password to update old password");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Change Password
  const updatePassword = await pool.query("UPDATE admins SET admin_password = $1 WHERE admin_email = $2", [hashedPassword, email]);

  const updatedAdmin = await pool.query("SELECT * FROM admins WHERE admin_email = $1", [email])

  if (updatedAdmin.rowCount !== 0) {
    const result = updatedAdmin.rows[0];
    res.status(201).json({
      id: result.admin_uuid,
      token: generateToken(result.admin_uuid),
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
