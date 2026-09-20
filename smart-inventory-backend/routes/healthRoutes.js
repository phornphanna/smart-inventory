const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { executeDailySweep } = require("../jobs/dailySweep");
const { sendTelegramMessage } = require("../utils/telegram");

// Manual trigger for testing telegram connection
router.post("/test-telegram", async (req, res, next) => {
  try {
    const testMsg = `🔔 *Test Notification*\nSmart Inventory Backend is connected to Telegram!`;
    const result = await sendTelegramMessage(testMsg);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Manual trigger for testing daily sweep
router.post("/test-daily-sweep", async (req, res, next) => {
  try {
    await executeDailySweep();
    res.status(200).json({ success: true, message: "Daily sweep triggered manually" });
  } catch (error) {
    next(error);
  }
});

router.get('/health', async (req, res , next) => {

    try {
           // perform simple query to ensure DB pool is reachable 
            const [rows] = await db.query('SELECT 1 + 1 AS result');
            res.status(200).json({
                success: true,
                message: 'Server is healthy and database is connected',
              data : {
                  dbStatus: "connected",
                  pingResult: rows[0].result,
              },
            });
    } catch (error) {
        next(error);
    }
});


// Manual trigger for testing telegram connection
router.post("/test-telegram", async (req, res, next) => {
  try {
    const testMsg = `🔔 *Test Notification*\nSmart Inventory Backend is connected to Telegram!`;
    const result = await sendTelegramMessage(testMsg);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Manual trigger for testing daily sweep
router.post("/test-daily-sweep", async (req, res, next) => {
  try {
    await executeDailySweep();
    res.status(200).json({ success: true, message: "Daily sweep triggered manually" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;