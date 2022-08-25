const express = require("express");
const router = express.Router();
const {
  generateQrCode,
  scanQrCode,
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

/**
 *@swagger
 * paths:
 *  /api/qr-code/scan:
 *    post:
 *      description: Use to scan QR Code
 *      responses:
 *        '200':
 *          description: QR Code successfully scanned
 */
router.post("/scan", scanQrCode);

module.exports = router;
