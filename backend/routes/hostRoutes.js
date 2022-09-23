const express = require("express");
const router = express.Router();
const {
  getHosts,
  getHost,
  loginHost,
  updateHostPassword,
  getConfirmationCode
} = require("../controllers/hostController");



/**
 *@swagger
 * paths:
 *  /api/hosts:
 *    get:
 *      description: Use to get all hosts
 *      responses:
 *        '200':
 *          description: Hosts successfully fetched
 */
router.get("/", getHosts);

/**
 *@swagger
 * paths:
 *  /api/hosts/:id:
 *    get:
 *      description: Use to get a host
 *      responses:
 *        '200':
 *          description: Host successfully fetched
 */
router.get("/host/:id", getHost);



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
router.post("/login", loginHost);

/**
 *@swagger
 * paths:
 *  /api/hosts/confirmation-code:
 *    post:
 *      description: Use to create confirmation code for a host
 *      responses:
 *        '200':
 *          description: Confirmation code successfully created
 */
router.post("/confirmation-code", getConfirmationCode);

/**
 *@swagger
 * paths:
 *  /api/hosts/reset:
 *    post:
 *      description: Use to change host password
 *      responses:
 *        '200':
 *          description: Host password successfully changed
 */
router.put("/reset", updateHostPassword);

module.exports = router;
