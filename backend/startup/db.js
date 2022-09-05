const Pool = require("pg").Pool;

const devConfig = {
  user: "postgres",
  password: process.env.PSQL_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "vilog",
};

const prodConfig = {
  connectionString: process.env.DATABASE_URL
}

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);

module.exports = pool;
