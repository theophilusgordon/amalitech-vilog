const express = require("express");
const port = process.env.PORT || 5000;
const swaggerDocs = require("./startup/swagger");
const errorHandler = require("./middleware/errorMiddleware");
require("dotenv").config();
const cors = require("cors");
const { adminProtect } = require("./middleware/authMiddleware");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/hosts", [adminProtect], require("./routes/hostRoutes"));
app.use("/api/guests", require("./routes/guestRoutes"));
app.use("/api/visit-logs", require("./routes/visitLogRoutes"));
app.use("/api/export-csv", require("./routes/exportCSVRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
  swaggerDocs(app, port);
});
