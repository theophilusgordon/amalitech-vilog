const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const sms = require('sms-service');
const smsService = new sms.SMSService();
const {v4: uuidv4} = require('uuid');
const pool = require("../startup/db");

// @desc: Sign In A Visitor
// @route: POST /api/visit-logs/check-in/:id
// @access: Public
const checkInGuest = asyncHandler(async(req, res) => {
  const id = req.params.id;
  const {host_id} = req.body;

  const guestExists = await pool.query("SELECT * FROM guests WHERE guest_uuid = $1", [id]);

if(guestExists.rowCount === 0){
  res.status(400);
  throw new Error("Cannot check in invalid user");
}

const generatedId = uuidv4();

  await pool.query(
    "INSERT INTO visit_logs(visit_log_uuid, sign_in, guest_id) VALUES($1, $2, $3)",
    [generatedId, new Date(Date.now()), id]
  );

  await pool.query("UPDATE guests SET guest_host_id = $1", [host_id]);

  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid WHERE visit_log_uuid = $1", [generatedId]
  );

  const result = log_info.rows;
  res.status(201).json(result);

  const message = `Hello ${result[0].host_first_name} ${result[0].host_last_name}, ${result[0].guest_first_name} ${result[0].guest_last_name} has just checked in at ${result[0].sign_in} to see you. 

  Contact Details.
  Email: ${result[0].guest_email}
  Phone: ${result[0].guest_phone}`;

  smsService.sendSMS(result.host_phone, message);
});

// @desc: Sign Out A Visitor
// @route: POST /api/visit-logs/check-out/:id
// @access: Public
const checkOutGuest = asyncHandler(async(req, res) => {
  const id = req.params.id;

  const guestExists = await pool.query("SELECT * FROM guests WHERE guest_uuid = $1", [id]);

// Check if visitor exists
if(guestExists.rowCount === 0){
  res.status(400);
  throw new Error("Cannot check in invalid user");
}

// Check if visitor is signed in
if(guestExists.rows[0].sign_in === null){
  res.status(400);
  throw new Error("Visitor is not signed in");
}

  await pool.query(
    "UPDATE visit_logs SET sign_out = $1",
    [new Date(Date.now())]
  );


  // TODO: Add condition here
  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid"
  );

  const result = log_info.rows;
  res.status(201).json(result);

  const message = `Hello ${result.host_first_name} ${result.host_last_name}, ${result.guest_first_name} ${result.guest_last_name} has just checked out at ${result.sign_in} after seeing you. 

  Contact Details.
  Email: ${result.guest_email}
  Phone: ${result.guest_phone}`;

  smsService.sendSMS(result.host_phone, message);
});

const getVisitLogs = asyncHandler(async (req, res) => {
  const log_info = await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid"
  );

  const result = log_info.rows;
  res.status(201).json(result);
});

const getVisitLog = asyncHandler(async (req, res) => {
  const id = req.params.id;
      const log_info = await pool.query(
        "SELECT * FROM guests LEFT JOIN hosts ON hosts.host_uuid = guests.guest_host_id LEFT JOIN visit_logs ON visit_logs.guest_id = guests.guest_uuid WHERE guest_uuid = $1", [id]
      );

      const result = log_info.rows;
      res.status(201).json(result);
});

// TODO: Create export to csv function and associated routes

module.exports = {checkInGuest, getVisitLogs, getVisitLog, checkOutGuest}