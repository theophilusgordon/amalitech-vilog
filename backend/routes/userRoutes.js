const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  updateUserPassword,
  getConfirmationCode,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/confirmationcode", getConfirmationCode);
router.patch("/reset", updateUserPassword);

module.exports = router;
