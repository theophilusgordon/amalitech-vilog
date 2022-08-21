const express = require("express");
const router = express.Router();
const {
  registerGuest,
  getGuests,
  getGuest,
  updateGuest,
} = require("../controllers/guestController");

/**
 *@swagger
 * paths:
 *  /api/guests/register:
 *    post:
 *      description: Use to add a guest
 *      responses:
 *        '200':
 *          description: Guest successfully added
 */
router.post("/register", registerGuest);

/**
 *@swagger
 * paths:
 *  /api/guests:
 *    get:
 *      description: Use to get all guests
 *      responses:
 *        '200':
 *          description: Guests successfully fetched
 */
router.get("/", getGuests);

/**
 *@swagger
 * paths:
 *  /api/guests/:id:
 *    get:
 *      description: Use to get a guest
 *      responses:
 *        '200':
 *          description: Guest successfully fetched
 */
router.get("/:id", getGuest);

/**
 *@swagger
 * paths:
 *  /api/guests/:id:
 *    put:
 *      description: Use to change a guest information
 *      responses:
 *        '200':
 *          description: Host information successfully changed
 */
router.put("/:id", updateGuest);

module.exports = router;
