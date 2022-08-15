const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "gordon",
  host: "localhost",
  port: 5432,
  database: "vilog",
});

module.exports = pool;
