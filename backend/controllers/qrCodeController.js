const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const pool = require("../startup/db");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

// @desc: Generate QR Code
// @route: POST /api/qr-code/generate
// @access: Public
const generateQrCode = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    // Validate user input
    if (!id) {
      res.status(400);
      throw new Error("Guest Id is required");
    }

    const guest = await pool.query(
      "SELECT * FROM guests WHERE guest_uuid = $1",
      [id]
    );

    // Validate is user exist
    if (guest.rowCount === 0) {
      res.status(400);
      throw new Error("Guest not found");
    }

    const qrExist = await pool.query(
      "SELECT * FROM qr_code WHERE guest_id = $1",
      [id]
    );

    // If qr exist, update disable to true and then create a new qr record
    if (qrExist.rowCount !== 0) {
      await pool.query(
        "INSERT INTO qr_code (qr_code_uuid, guest_id, disabled) VALUES($1, $2, $3)",
        [uuidv4(), id, false]
      );
    } else {
      await pool.query("UPDATE qr_code SET disabled = $1 WHERE guest_id = $2", [
        true,
        id,
      ]);
      await pool.query(
        "INSERT INTO qr_code (qr_code_uuid, guest_id, disabled) VALUES($1, $2, $3)",
        [uuidv4(), id, false]
      );
    }

    // Generate QR code
    const dataImage = await QRCode.toDataURL(guest.rows[0].guest_uuid);

    // Find user email and send them qr code
    const guestInfo = await pool.query(
      "SELECT * FROM guests WHERE guest_uuid = $1",
      [id]
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

    <p>Use the QR code in this email to check in on your next visit.</p> `,
      attachments: [
        {
          filename: "qr-image.png",
          path: dataImage,
        },
      ],
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

module.exports = {
  generateQrCode,
};
