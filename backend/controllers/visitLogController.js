const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const pool = require("../startup/db");
const { v4: uuidv4 } = require("uuid");
const sms = require("sms-service");
const smsService = new sms.SMSService();

// @desc: Sign In A Visitor
// @route: POST /api/visit-logs/check-in/:id
// @access: Public
const checkInGuest = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { host_id } = req.body;

  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_uuid = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error("Cannot check in invalid user");
  }

  // const guestFromLogs = await pool.query(
  //   "SELECT sign_in FROM visit_logs WHERE guest_id = $1",
  //   [id]
  // );

  // if (!guestFromLogs.rows[0].sign_in) {
  //   res.status(400);
  //   throw new Error("Visitor is already signed in");
  // }

  const generatedId = uuidv4();

  await pool.query(
    "INSERT INTO visit_logs(visit_log_uuid, sign_in, guest_id) VALUES($1, $2, $3)",
    [generatedId, new Date(Date.now()), id]
  );

  await pool.query(
    "UPDATE guests SET guest_host_id = $1 WHERE guest_uuid = $2",
    [host_id, id]
  );

  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid WHERE visit_log_uuid = $1",
    [generatedId]
  );

  const result = log_info.rows;

  const message = `Hello ${result[0].host_first_name} ${result[0].host_last_name}, ${result[0].guest_first_name} ${result[0].guest_last_name} has just checked in at ${result[0].sign_in} to see you. 
  
  Contact Details.
  Email: ${result[0].guest_email}
  Phone: ${result[0].guest_phone}`;

  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.VILOG_EMAIL,
      pass: process.env.VILOG_PASS,
    },
  });

  const mailOptions = {
    from: process.env.VILOG_EMAIL,
    to: result[0].host_email,
    subject: "You have a guest",
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500);
      console.log(error);
      throw new Error("Internal Server Error. Email not sent to host");
    } else {
      res.status(200).send(`Email sent: ${info.response}`);
    }
  });

  res.status(201).json(result[0]);

  // smsService.sendSMS(result.host_phone, message);
});

// @desc: Sign Out A Visitor
// @route: POST /api/visit-logs/check-out
// @access: Public
const checkOutGuest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_email = $1",
    [email]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error("Cannot check in invalid user");
  }

  const searchId = await pool.query(
    "SELECT guest_uuid FROM guests WHERE guest_email = $1",
    [email]
  );

  const id = searchId.rows[0].guest_uuid;

  const guestFromLogs = await pool.query("SELECT sign_in, sign_out FROM visit_logs WHERE guest_id = $1", [id]);

  if (guestFromLogs.rows[0].sign_in === null) {
    res.status(400);
    throw new Error("Visitor is not signed in");
  }

  await pool.query(
    "UPDATE visit_logs SET sign_out = $1 WHERE guest_id = $2 AND sign_out IS NULL",
    [new Date(Date.now()), id]
  );

  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid"
  );

  const result = log_info.rows[0];

  const message = `Hello ${result.host_first_name} ${result.host_last_name}, ${result.guest_first_name} ${result.guest_last_name} has just checked out at ${result.sign_out} after seeing you. 
  
  Contact Details.
  Email: ${result.guest_email}
  Phone: ${result.guest_phone}`;

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
    subject: "Your guest is leaving",
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500);
      console.log(error);
      throw new Error("Internal Server Error. Email not sent to host");
    } else {
      res.status(200).send(`Email sent: ${info.response}`);
    }
  });

  // smsService.sendSMS(result.host_phone, message);
  res.status(201).json(result);
});

// @desc: Get all visit logs
// @route: GET /api/visit-logs
// @access: Public
const getVisitLogs = asyncHandler(async (req, res) => {
  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid ORDER BY sign_in DESC"
  );

  const result = log_info.rows;
  res.status(201).json(result);
});

// @desc: Get all visit logs
// @route: GET /api/visit-logs/:id
// @access: Public
const getHostVisitLogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid WHERE guest_host_id = $1 ORDER BY sign_in DESC",
    [id]
  );

  const result = log_info.rows;
  res.status(201).json(result);
});

module.exports = {
  checkInGuest,
  getVisitLogs,
  checkOutGuest,
  getHostVisitLogs,
};
