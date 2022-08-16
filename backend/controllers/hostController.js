const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../startup/db");

// @desc: Register New Host
// @route: POST /api/hosts
// @access: Public
const registerHost = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;

  if (!first_name || !last_name || !email || !phone || !company) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if host already exists
  const hostExists = await pool.query("SELECT * FROM hosts WHERE email = $1", [
    email,
  ]);

  if (hostExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Host already exists");
  }

  // Create Host
  const host = await pool.query(
    "INSERT INTO hosts (profile_pic, first_name, last_name, email, phone, company, user_type) VALUES($1, $2, $3, $4, $5, $6, 'host') RETURNING *",
    [profile_pic, first_name, last_name, email, phone, company]
  );

  if (host.rowCount !== 0) {
    const result = host.rows[0];
    res.status(201).json({
      host_id: result.host_id,
      profile_pic: result.profile_pic,
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      phone: result.phone,
      user_type: result.user_type,
      token: generateToken(result.host_id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc: Get All Hosts
// @route: GET /api/hosts
// @access: Private
const getHosts = asyncHandler(async (req, res) => {
  const hosts = await pool.query("SELECT * FROM hosts");
  res.status(200).json(hosts.rows[0]);
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

  // Check if host already exists
  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_id = $1",
    [id]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Host with id: ${id} does not exist`);
  }

  const host = await pool.query(
    "SELECT host_id, first_name, last_name, email, phone, user_type, token FROM hosts WHERE host_id = $1",
    [id]
  );

  res.status(200).json(host.rows[0]);
});

// @desc: Update host information
// @route: GET /api/hosts/:id
// @access: Private
const updateHost = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if host already exists
  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_id = $1",
    [id]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Host with id: ${id} does not exist`);
  }

  const host = await pool.query(
    "UPDATE hosts SET profile_pic = $1 WHERE host_id = $2",
    [profile_pic, id]
  );
  res.status(200).json(host.rows[0]);
});

// @desc: Delete A Host
// @route: GET /api/hosts/:id
// @access: Private
const deleteHost = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if host already exists
  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_id = $1",
    [id]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Host with id: ${id} does not exist`);
  }

  const host = await pool.query("DELETE FROM hosts WHERE host_id = $1", [id]);
  res.status(200).json(host.rows[0]);
});

module.exports = {
  registerHost,
  getHosts,
  getHost,
  updateHost,
  deleteHost,
};
