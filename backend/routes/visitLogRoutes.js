const express = require("express");
const router = express.Router();
const {
  checkInGuest,
  checkOutGuest,
  getVisitLogs,
  getHostVisitLogs,
} = require("../controllers/visitLogController");

/**
 *@swagger
 * paths:
 *  /api/visit-logs/check-in/:id:
 *    post:
 *      description: Use to check in a guest
 *      responses:
 *        '200':
 *          description: Guest successfully checked in
 */
router.post("/check-in/:id", checkInGuest);

/**
 *@swagger
 * paths:
 *  /api/visit-logs/check-out/:id:
 *    post:
 *      description: Use to check out a guest
 *      responses:
 *        '200':
 *          description: Guest successfully checked out
 */
router.post("/check-out", checkOutGuest);

/**
 *@swagger
 * paths:
 *  /api/visit-logs:
 *    get:
 *      description: Use to get all visit logs
 *      responses:
 *        '200':
 *          description: Visit logs successfully fetched
 */
router.get("/", getVisitLogs);

/**
 *@swagger
 * paths:
 *  /api/visit-logs/:id:
 *    get:
 *      description: Use to get information about a specific host's visit log
 *      responses:
 *        '200':
 *          description: Visit log successfully fetched
 */
router.get("/:id", getHostVisitLogs);

module.exports = router;
