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

  const adminExists = await pool.query(
    "SELECT * FROM admins WHERE admin_email = $1",
    [email]
  );

  if (adminExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await pool.query("UPDATE admins SET admin_password = $1 WHERE admin_email = $2", [hashedPassword, email]);

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

// @desc: Register New Host
// @route: POST /api/admins/host/register
// @access: Private
const registerHost = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;

  if (!first_name || !last_name || !email || !phone || !company) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_email = $1",
    [email]
  );

  if (hostExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Host already exists");
  }

  const host = await pool.query(
    "INSERT INTO hosts (host_uuid, host_profile_pic, host_first_name, host_last_name, host_email, host_phone, host_company) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [uuidv4(), profile_pic, first_name, last_name, email, phone, company]
  );

  if (host.rowCount !== 0) {
    const result = host.rows[0];
    res.status(201).json({
      host_id: result.host_uuid,
      profile_pic: result.host_profile_pic,
      name: `${result.host_first_name} ${result.host_last_name}`,
      email: result.host_email,
      phone: result.host_phone,
      token: generateToken(result.host_uuid),
    });

    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.VILOG_EMAIL,
        pass: process.env.VILOG_PASS,
      },
    });

    const mailOptions = {
      from: process.env.VILOG_EMAIL,
      to: result.host_email,
      subject: "AmaliTech ViLog added you as a Host",
      text: `Hi ${result.host_first_name},

      You have been added as a host on the AmaliTech ViLog System. You can login in with your email and password. 
      
      Your default password is 1234. Please change this to a more secure password.`,
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
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc: Delete A Host
// @route: DELETE /api/admins/host/:id
// @access: Private
const deleteHost = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_uuid = $1",
    [id]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Host with id: ${id} does not exist`);
  }

  const host = await pool.query("DELETE FROM hosts WHERE host_uuid = $1", [id]);
  res.status(200).json(host.rows[0]);
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getConfirmationCode,
  updateAdminPassword,
  registerHost,
  deleteHost,
};
