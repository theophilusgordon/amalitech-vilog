const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const pool = require("../startup/db");

// @desc: Register New User
// @route: POST /api/users
// @access: Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, phone, company, user_type, password } =
    req.body;

  if (!first_name || !last_name || !email || !phone || !company || !password) {
    res.status(400);
    throw new Error("Please add all fields");
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

  // Create User
  const admin = await pool.query(
    "INSERT INTO admins (first_name, last_name, email, phone, company, user_type, password) VALUES($1, $2, $3, $4, $5, 'admin', $6) RETURNING *",
    [first_name, last_name, email, phone, company, hashedPassword]
  );

  if (admin.rowCount !== 0) {
    const result = admin.rows[0];
    res.status(201).json({
      admin_id: result.admin_id,
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

// @desc: Authenticate A User
// @route: POST /api/users/login
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

  if (admin.rowCount !== 0 && (await bcrypt.compare(password, admin.rows[0].password))) {
      const result = admin.rows[0];
    res.status(200).json({
      admin_id: result.admin_id,
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

// @desc: Get Confirmation Code
// @route: GET /api/users/confirmationcode
// @access: Public
// const getConfirmationCode = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error("Email is required to get OTP");
//   }

//   const adminExists = await pool.query(
//      "SELECT * FROM admins WHERE email = $1", [email]
//   );

//   if (!adminExists) {
//     res.status(400);
//     throw new Error("Invalid user email");
//   }

//   // Generate OTP
//   function generateConfirmationCode() {
//     let result = "";
//     const characters = "0123456789";
//     for (let i = 0; i < 7; i++) {
//       result += characters.charAt(
//         Math.floor(Math.random() * characters.length)
//       );
//     }
//     return result;
//   }

//   const adminConfirmationCode = generateConfirmationCode();

//   const confirmationCode = await OTP.create({
//     otpKey: userOTP,
//     author: {
//       email,
//     },
//   });

//   if (otp) {
//     res.status(201).json({
//       _id: otp.id,
//       author: email,
//     });
//   } else {
//     res.status(500);
//     throw new Error("OTP could not be generated. Please try again");
//   }

//   const transporter = nodemailer.createTransport({
//     service: "outlook",
//     auth: {
//       user: process.env.MICRO_EMAIL,
//       pass: process.env.MICRO_PASS,
//     },
//   });

//   const mailOptions = {
//     from: "acm.microfocus@hotmail.com",
//     to: email,
//     subject: "Access Key Manager Password Change",
//     text: `Use the OTP provided in this email to reset your password on Access Key Manager.

//     OTP: ${userOTP}`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       res.status(400);
//       throw new Error("OTP could not be sent to email. Please try again");
//     } else {
//       res.status(200).send(`Email sent: ${info.response}`);
//     }
//   });
// });

// // @desc: Reset User Password
// // @route: PATCH /api/users/user
// // @access: Public
// const updateUserPassword = asyncHandler(async (req, res) => {
//   const { otp, password, email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error("Please provide email one more time to change password");
//   }

//   if (!otp) {
//     res.status(400);
//     throw new Error("Please provide OTP sent to your email to change password");
//   }

//   const userOTP = await OTP.find({ "author.email": email });
//   const otpKey = userOTP[userOTP.length - 1].otpKey;

//   if (otp !== otpKey) {
//     res.status(400);
//     throw new Error("Invalid OTP");
//   }

//   if (!password) {
//     res.status(400);
//     throw new Error("Please provide a new password to update old password");
//   }

//   // Hash Password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Change Password
//   const user = await User.findOneAndUpdate(
//     { email: req.body.email },
//     {
//       password: hashedPassword,
//     },
//     { new: true }
//   );

//   if (user) {
//     res.status(201).json({
//       _id: user.id,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data to reset password");
//   }
// });

module.exports = {
  registerAdmin,
  loginAdmin,
};
