const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
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
    "SELECT * FROM guests WHERE email = $1",
    [email]
  );

  if (guestExists.rowCount !== 0) {
    res.status(400);
    throw new Error("Guest already exists");
  }

  // Create Guest
  const guest = await pool.query(
    "INSERT INTO guests (profile_pic, first_name, last_name, email, phone, company, user_type) VALUES($1, $2, $3, $4, $5, $6, 'guest') RETURNING *",
    [profile_pic, first_name, last_name, email, phone, company]
  );

  if (guest.rowCount !== 0) {
    const result = guest.rows[0];
    res.status(201).json({
      guest_id: result.guest_id,
      profile_pic: result.profile_pic,
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      phone: result.phone,
      user_type: result.user_type,
      token: generateToken(result.guest_id),
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
  res.status(200).json(guests.rows[0]);
});

// @desc: Get A Guest
// @route: GET /api/guests/:id
// @access: Private
const getGuest = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if guest already exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_id = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Guest with id: ${id} does not exist`);
  }

  const guest = await pool.query(
    "SELECT guest_id, first_name, last_name, email, phone, user_type, token FROM guests WHERE guest_id = $1",
    [id]
  );

  res.status(200).json(guest.rows[0]);
});

// @desc: Update guest information
// @route: GET /api/guests/:id
// @access: Private
const updateGuest = asyncHandler(async (req, res) => {
  const { profile_pic, first_name, last_name, email, phone, company } =
    req.body;
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if guest already exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_id = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Guest with id: ${id} does not exist`);
  }

  const guest = await pool.query(
    "UPDATE guests SET profile_pic = $1 WHERE guest_id = $2",
    [profile_pic, id]
  );
  res.status(200).json(guest.rows[0]);
});

// @desc: Delete A Guest
// @route: GET /api/guests/:id
// @access: Private
const deleteGuest = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide an id");
  }

  // Check if guest already exists
  const guestExists = await pool.query(
    "SELECT * FROM guests WHERE guest_id = $1",
    [id]
  );

  if (guestExists.rowCount === 0) {
    res.status(400);
    throw new Error(`Guest with id: ${id} does not exist`);
  }

  const guest = await pool.query("DELETE FROM guests WHERE guest_id = $1", [
    id,
  ]);
  res.status(200).json(guest.rows[0]);
});

module.exports = {
  registerGuest,
  getGuests,
  getGuest,
  updateGuest,
  deleteGuest,
};
