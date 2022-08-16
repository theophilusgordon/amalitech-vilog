const express = require("express");
const router = express.Router();
const {
  registerHost,
  getHosts,
  getHost,
  updateHost,
  deleteHost,
} = require("../controllers/hostController");

/**
 *@swagger
 * paths:
 *  /api/hosts/register:
 *    post:
 *      description: Use to add a host
 *      responses:
 *        '200':
 *          description: Host successfully added
 */
router.post("/register", registerHost);

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
router.get("/:id", getHost);

/**
 *@swagger
 * paths:
 *  /api/hosts/:id:
 *    put:
 *      description: Use to change a host information
 *      responses:
 *        '200':
 *          description: Host information successfully changed
 */
router.put("/:id", updateHost);

/**
 *@swagger
 * paths:
 *  /api/hosts/:id:
 *    delete:
 *      description: Use to delete a host
 *      responses:
 *        '200':
 *          description: Host successfully deleted
 */
router.delete("/:id", deleteHost);

module.exports = router;
