const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const pool = require("../startup/db");

// @desc: Create New Visit Log
// @route: POST /api/visit-logs
// @access: Public
const createVisitLog = asyncHandler(async(req, res) => {

  res.send("Creating visit log");
});

const getVisitLogs = asyncHandler(async (req, res) => {
    res.send("Getting visit log");
});

const getVisitLog = asyncHandler(async (req, res) => {
    res.send("Getting a visit log");
});

module.exports = {createVisitLog, getVisitLogs, getVisitLog}