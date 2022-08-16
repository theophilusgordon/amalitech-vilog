const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getConfirmationCode,
  updateAdminPassword,
} = require("../controllers/adminController");

/**
 *@swagger
 * paths:
 *  /api/admins/register:
 *    post:
 *      description: Use to add an admin
 *      responses:
 *        '200':
 *          description: Admin successfully added
 */
router.post("/register", registerAdmin);

/**
 *@swagger
 * paths:
 *  /api/admins/login:
 *    post:
 *      description: Use to authenticate an admin
 *      responses:
 *        '200':
 *          description: Admin successfully authenticated
 */
router.post("/login", loginAdmin);

/**
 *@swagger
 * paths:
 *  /api/admins/confirmation-code:
 *    post:
 *      description: Use to create confirmation code for an admin
 *      responses:
 *        '200':
 *          description: Confirmation code successfully created
 */
router.post("/confirmation-code", getConfirmationCode);

/**
 *@swagger
 * paths:
 *  /api/admins/reset:
 *    post:
 *      description: Use to change admin password
 *      responses:
 *        '200':
 *          description: Admin password successfully changed
 */
router.put("/reset", updateAdminPassword);

module.exports = router;
