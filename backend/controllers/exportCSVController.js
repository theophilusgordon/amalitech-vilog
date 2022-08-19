const asyncHandler = require("express-async-handler");
const pool = require("../startup/db");
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("visit-logs-data.csv");

// @desc: Export visit logs to csv
// @route: GET /api/export-csv
// @access: Public
const exportToCSV = asyncHandler(async (req, res) => {
  await pool.query(
    "SELECT * FROM guests LEFT JOIN hosts ON guest_host_id = hosts.host_uuid  LEFT JOIN visit_logs ON guest_uuid = visit_logs.guest_id",
    (error, data) => {
      if (error) throw new Error(error);
      // console.log(data.fields)

      const jsonData = JSON.parse(JSON.stringify(data.fields));
      // console.log(jsonData);

      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", () => res.status(201).send("Data successfully written to visit-logs-data.csv"))
        .pipe(ws);
    }
  );
});

module.exports = { exportToCSV };
