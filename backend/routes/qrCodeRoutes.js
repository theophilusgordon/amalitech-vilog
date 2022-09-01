const express = require("express");
const router = express.Router();
const {
  generateQrCode,
} = require("../controllers/qrCodeController");

/**
 *@swagger
 * paths:
 *  /api/qr-code/generate:
 *    post:
 *      description: Use to generate QR Code
 *      responses:
 *        '200':
 *          description: QR Code generated
 */
router.post("/generate", generateQrCode);


module.exports = router;
