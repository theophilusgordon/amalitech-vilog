const express = require("express");
const router = express.Router();
const {
  createVisitLog,
  getVisitLogs,
  getVisitLog,
} = require("../controllers/visitLogController");

/**
 *@swagger
 * paths:
 *  /api/visit-logs:
 *    post:
 *      description: Use to add a visit log information
 *      responses:
 *        '200':
 *          description: Visit log successfully created
 */
router.post("/", createVisitLog);

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
 *      description: Use to get information about a specific visit log
 *      responses:
 *        '200':
 *          description: Visit log successfully fetched
 */
router.get("/:id", getVisitLog);

module.exports = router;
