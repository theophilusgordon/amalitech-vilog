const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool = require("../startup/db");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const fs = require("fs");

// @desc: Generate QR Code
// @route: POST /api/qr-code/generate
// @access: Public
const generateQrCode = asyncHandler(async (req, res) => {
  try {
    const { guestId } = req.body;

    // Validate user input
    if (!guestId) {
      res.status(400);
      throw new Error("Guest Id is required");
    }

    const guest = await pool.query(
      "SELECT * FROM guests WHERE guest_uuid = $1",
      [guestId]
    );

    // Validate is user exist
    if (guest.rowCount === 0) {
      res.status(400);
      throw new Error("Guest not found");
    }

    const qrExist = await pool.query(
      "SELECT * FROM qr_code WHERE guest_id = $1",
      [guestId]
    );

    // If qr exist, update disable to true and then create a new qr record
    if (qrExist.rowCount !== 0) {
      await pool.query(
        "INSERT INTO qr_code (qr_code_uuid, guest_id, disabled) VALUES($1, $2, $3)",
        [uuidv4(), guestId, false]
      );
    } else {
      await pool.query("UPDATE qr_code SET disabled = $1 WHERE guest_id = $2", [
        true,
        guestId,
      ]);
      await pool.query(
        "INSERT INTO qr_code (qr_code_uuid, guest_id, disabled) VALUES($1, $2, $3)",
        [uuidv4(), guestId, false]
      );
    }

    // Generate qr code
    const dataImage = await QRCode.toString(guest.rows[0].guest_uuid);

    // Find user email and send them qr code
    const guestInfo = await pool.query(
      "SELECT * FROM guests WHERE guest_uuid = $1",
      [guestId]
    );

    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.VILOG_EMAIL,
        pass: process.env.VILOG_PASS,
      },
    });

    const mailOptions = {
      from: process.env.VILOG_EMAIL,
      to: guestInfo.rows[0].guest_email,
      subject: "QR Code for your next check in at AmaliTech",
      html: `Hi ${guestInfo.rows[0].guest_first_name},

    Use the QR code in this email to check in on your next visit.
    
    <img src="${dataImage}" />`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400);
        console.log(error);
        throw new Error("QR code could not be sent to email. Please try again");
      } else {
        res.status(200).send(`Email sent: ${info.response}`);
      }
    });

    // Return qr code
    return res.status(200).json({ dataImage });
  } catch (err) {
    console.log(err);
  }
});

// @desc: Scan QR Code
// @route: POST /api/qr-code/scan
// @access: Public
const scanQrCode = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).send("Token is required");
    }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const result = await QRCode.toString(token);

    // const qrCode = await pool.query("SELECT * FROM qr_code WHERE guest_id = $1 AND disabled = false", [decoded.user_id])

    // if (!qrCode) {
    //   res.status(400).send("QR Code not found");
    // }

    // const connectedDeviceData = {
    //   userId: decoded.userId,
    //   qrCodeId: qrCode._id,
    //   deviceName: deviceInformation.deviceName,
    //   deviceModel: deviceInformation.deviceModel,
    //   deviceOS: deviceInformation.deviceOS,
    //   deviceVersion: deviceInformation.deviceVersion,
    // };

    // const connectedDevice = await ConnectedDevice.create(connectedDeviceData);

    // // Update qr code
    // await QRCode.findOneAndUpdate(
    //   { _id: qrCode._id },
    //   {
    //     isActive: true,
    //     connectedDeviceId: connectedDevice._id,
    //     lastUsedDate: new Date(),
    //   }
    // );

    // // Find user
    // const user = await User.findById(decoded.userId);

    // // Create token
    // const authToken = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
    //   expiresIn: "2h",
    // });

    // // Return token
    return res.status(200).json({ token: result });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  generateQrCode,
  scanQrCode,
};
