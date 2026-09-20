const https = require("https");
require("dotenv").config();

/**
 * Sends a message via Telegram Bot API using native HTTPS
 * @param {string} message - Markdown or text formatted message
 */
const sendTelegramMessage = (message) => {
  return new Promise((resolve, reject) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Skip if telegram credentials are not configured
    if (!token || !chatId || token === "dummy_token") {
      console.warn("Telegram alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing.");
      return resolve(null);
    }

    const payload = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            resolve(parsed);
          } else {
            console.error("Telegram API Error Response:", parsed.description);
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on("error", (error) => {
      console.error("Failed to send Telegram alert:", error.message);
      resolve(null); // Resolve cleanly so server processes never crash from alert timeouts
    });

    req.write(payload);
    req.end();
  });
};

module.exports = {
  sendTelegramMessage,
};