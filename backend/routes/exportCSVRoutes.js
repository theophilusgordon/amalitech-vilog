const express = require("express");
const router = express.Router();
const { exportToCSV } = require("../controllers/exportCSVController");

/**
 *@swagger
 * paths:
 *  /api/visit-logs/export:
 *    get:
 *      description: Use to generate CSV report of visit logs
 *      responses:
 *        '200':
 *          description: Write visit logs to csv successfully completed
 */
router.get("/", exportToCSV);

module.exports = router;
