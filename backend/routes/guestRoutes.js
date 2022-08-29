const express = require("express");
const router = express.Router();
const {
  registerGuest,
  getGuests,
  getGuest,
  updateGuest,
  getHostGuests,
  searchHosts,
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
 *  /api/guests/host/:id:
 *    get:
 *      description: Use to get all guests
 *      responses:
 *        '200':
 *          description: Guests successfully fetched
 */
router.get("/host/:id", getHostGuests);

/**
 *@swagger
 * paths:
 *  /api/guests/guest/guest/:id:
 *    get:
 *      description: Use to get a guest
 *      responses:
 *        '200':
 *          description: Guest successfully fetched
 */
router.get("/guest/:id", getGuest);

/**
 *@swagger
 * paths:
 *  /api/guests/guest/:id:
 *    put:
 *      description: Use to change a guest information
 *      responses:
 *        '200':
 *          description: Host information successfully changed
 */
router.put("/guest/:id", updateGuest);

/**
 *@swagger
 * paths:
 *  /api/guests/hosts:
 *    get:
 *      description: Use to search for hosts for guest
 *      responses:
 *        '200':
 *          description: Host information successfully fetched
 */
router.get("/hosts", searchHosts);

module.exports = router;
