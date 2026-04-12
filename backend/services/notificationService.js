const Notification = require("../models/Notification");
const logger = require("../utils/logger");

const SERVICE = "NotificationService";

// Create a notification for one user
exports.createNotification = async ({ recipient, type, title, message, link, meta }) => {
  try {
    const notif = await Notification.create({ recipient, type, title, message, link, meta });
    logger.info(SERVICE, "Notification created", { recipient, type });
    return notif;
  } catch (err) {
    logger.error(SERVICE, "Failed to create notification", { error: err.message });
  }
};

// Create notifications for many users (broadcast)
exports.broadcastNotification = async (recipientIds, payload) => {
  try {
    const docs = recipientIds.map((rid) => ({ recipient: rid, ...payload }));
    await Notification.insertMany(docs);
    logger.info(SERVICE, "Broadcast notification sent", { count: recipientIds.length });
  } catch (err) {
    logger.error(SERVICE, "Broadcast failed", { error: err.message });
  }
};
