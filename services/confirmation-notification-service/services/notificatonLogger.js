// services/notificationLogger.js
const fs = require('fs');
const path = require('path');

// Define the path for the log file inside a "logs" folder
const logFilePath = path.join(__dirname, '../logs/notifications.log');

/**
 * Logs a notification event to both the console and a file.
 * 
 * @param {string} type - Type of notification (e.g., EMAIL, SMS)
 * @param {string} to - Recipient address (email/phone)
 * @param {string} message - The notification message
 */
const logNotification = (type, to, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type.toUpperCase()}] To: ${to}, Message: ${message}`;

  // Console logging
  console.log(logEntry);

  // Ensure logs directory exists
  const logsDir = path.dirname(logFilePath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // File logging
  fs.appendFile(logFilePath, logEntry + '\n', (err) => {
    if (err) console.error('❌ Failed to write log:', err);
  });
};

module.exports = { logNotification };
