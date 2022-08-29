const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool = require("../startup/db");

// @desc: Register New Guest
// @route: POST /api/guests
// @access: Public
const registerGuest = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;

  if (!first_name || !last_name || !email || !phone || !company) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if guest already exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_email = $1",
    [email]
  );

  if (guestExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Guest already exists");
  }

  // Create Guest
  const guest = await pool.query(
    "INSERT INTO guests (guest_uuid, guest_profile_pic, guest_first_name, guest_last_name, guest_email, guest_phone, guest_company) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [uuidv4(), profile_pic, first_name, last_name, email, phone, company]
  );

  if (guest.rowCount !== 0) {
    const result = guest.rows[0];
    res.status(201).json({
      guest_id: result.guest_uuid,
      profile_pic: result.guest_profile_pic,
      name: `${result.guest_first_name} ${result.guest_last_name}`,
      email: result.guest_email,
      phone: result.guest_phone,
      user_type: result.guest_user_type,
      token: generateToken(result.guest_uuid),
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

// @desc: Get All Guests
// @route: GET /api/guests
// @access: Private
const getGuests = asyncHandler(async (req, res) => {
  const guests = await pool.query("SELECT * FROM guests");
  res.status(200).json(guests.rows);
});

// @desc: Get Belonging To A Host
// @route: GET /api/guests/host/:id
// @access: Private
const getHostGuests = asyncHandler(async (req, res) => {
  const {id} = req.params;

  // Check if host exists
  const hostExists = await pool.query('SELECT * FROM hosts WHERE host_uuid = $1', [id])
  if(hostExists.rowCount === 0){
    res.status(400);
    throw new Error("Host does not exist")
  }

  const guests = await pool.query("SELECT * FROM guests WHERE guest_host_id = $1", [id]);
  res.status(200).json(guests.rows);
});

// @desc: Get A Guest
// @route: GET /api/guests/guest/:id
// @access: Private
const getGuest = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if guest exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_uuid = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Guest with id: ${id} does not exist`);
  }

  const guest = await pool.query(
    "SELECT guest_id, guest_first_name, guest_last_name, guest_email, guest_phone, token FROM guests WHERE guest_uuid = $1",
    [id]
  );

  res.status(200).json(guest.rows[0]);
});

// @desc: Update guest information
// @route: PUT /api/guests/:id
// @access: Private
const updateGuest = asyncHandler(async (req, res) => {
  const { profile_pic } = req.body;
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if guest already exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_uuid = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Guest with id: ${id} does not exist`);
  }

  const guest = await pool.query(
    "UPDATE guests SET profile_pic = $1 WHERE guest_uuid = $2",
    [profile_pic, id]
  );
  res.status(200).json(guest.rows[0]);
});

// @desc: Get All Hosts
// @route: GET /api/guests/hosts
// @access: Private
const searchHosts = asyncHandler(async (req, res) => {
  const hosts = await pool.query("SELECT * FROM hosts");
  res.status(200).json(hosts.rows);
});

module.exports = {
  registerGuest,
  getGuests,
  getGuest,
  updateGuest,
  getHostGuests,
  searchHosts
};
