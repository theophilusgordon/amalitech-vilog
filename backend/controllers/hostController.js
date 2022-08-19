const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
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
  const hostExists = await pool.query("SELECT * FROM hosts WHERE host_email = $1", [
    email,
  ]);

  if (hostExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Host already exists");
  }

  // Create Host
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

// @desc: Update host information
// @route: GET /api/hosts/:id
// @access: Private
const updateHost = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;

    let field;

    if(profile_pic) field = profile_pic;
    if(first_name) field = first_name;
    if(last_name) field = last_name;
    if(email) field = email;
    if(phone) field = phone;
    if(company) field = company;
  

  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if host already exists
  const hostExists = await pool.query(
    "SELECT * FROM hosts WHERE host_uuid = $1",
    [id]
  );

  if (hostExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Host with id: ${id} does not exist`);
  }

  const host = await pool.query(
    "UPDATE hosts SET host_profile_pic = $1 WHERE host_uuid = $2",
    [field, id]
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
  registerHost,
  getHosts,
  getHost,
  updateHost,
  deleteHost,
};
