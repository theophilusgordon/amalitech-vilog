const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminController");

// Routes
/**
 *@swagger
 * api/admins/register:
 * post:
 *    description: Use to add an admin
 *    responses:
 *      '200':
 *        description: 'Admin successfully added'
 */ 
router.post("/register", registerAdmin);

router.post("/login", loginAdmin);
// router.post("/confirmation-code", getConfirmationCode);
// router.patch("/reset", updateUserPassword);

module.exports = router;
