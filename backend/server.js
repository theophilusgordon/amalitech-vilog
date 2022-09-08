const path = require("path");
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
app.use("/api/hosts", require("./routes/hostRoutes"));
app.use("/api/guests", require("./routes/guestRoutes"));
app.use("/api/visit-logs", require("./routes/visitLogRoutes"));
app.use("/api/export-csv", require("./routes/exportCSVRoutes"));
app.use("/api/qr-code", require("./routes/qrCodeRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) =>
    res.send("You should be in production environment to run this app")
  );
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
  swaggerDocs(app, port);
});
