const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool = require("../startup/db");
const nodemailer = require("nodemailer");

// @desc: Get All Hosts
// @route: GET /api/hosts
// @access: Private
const getHosts = asyncHandler(async (req, res) => {
  const hosts = await pool.query("SELECT * FROM hosts");
  res.status(200).json(hosts.rows);
});

// @desc: Get A Host
// @route: GET /api/hosts/:id
// @access: Private
const getHost = asyncHandler(async (req, res) => {
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

  const host = await pool.query(
    "SELECT host_uuid, host_first_name, host_last_name, host_email, host_phone, host_user_type, token FROM hosts WHERE host_id = $1",
    [id]
  );

  res.status(200).json(host.rows[0]);
});

// @desc: Authenticate A Host
// @route: POST /api/hosts/login
// @access: Public
const loginHost = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const host = await pool.query("SELECT * FROM hosts WHERE host_email = $1", [
    email,
  ]);

  if (
    host.rowCount !== 0 &&
    (await bcrypt.compare(password, host.rows[0].host_password))
  ) {
    const result = host.rows[0];
    res.status(200).json({
      host_id: result.host_uuid,
      profile_pic: result.host_profile_pic,
      name: `${result.host_first_name} ${result.host_last_name}`,
      email: result.host_email,
      phone: result.host_phone,
      token: generateToken(result.host_uuid),
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
// @route: POST /api/hosts/confirmation-code
// @access: Public
const getConfirmationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required to get confirmation code");
  }

  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_email = $1",
    [email]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error("Invalid host email");
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
    "UPDATE hosts SET host_confirmation_code_id = $1 WHERE host_email = $2",
    [confirmationCodeUUID, email]
  );

  if (postConfirmationCode.rowCount !== 0) {
    res.status(201).json(postConfirmationCode.rows[0]);
  } else {
    res.status(500);
    throw new Error(
      "Confirmation code could not be generated. Please try again"
    );
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
    subject: "AmaliTech ViLog Host Password Change",
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

// @desc: Reset Host Password
// @route: PUT /api/hosts/reset
// @access: Public
const updateHostPassword = asyncHandler(async (req, res) => {
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

  const hostConfirmationCode = await pool.query(
    "SELECT code FROM confirmation_code LEFT JOIN admins ON confirmation_code_uuid = admins.admin_confirmation_code_id"
  );

  if (
    confirmation_code !==
    hostConfirmationCode.rows[hostConfirmationCode.rowCount - 1].code
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

  await pool.query(
    "UPDATE hosts SET host_password = $1 WHERE host_email = $2",
    [hashedPassword, email]
  );

  const updatedHost = await pool.query(
    "SELECT * FROM admins WHERE admin_email = $1",
    [email]
  );

  if (updatedHost.rowCount !== 0) {
    const result = updatedHost.rows[0];
    res.status(201).json({
      id: result.host_uuid,
      token: generateToken(result.host_uuid),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data to reset password");
  }
});

module.exports = {
  getHosts,
  getHost,
  loginHost,
  updateHostPassword,
  getConfirmationCode,
};
