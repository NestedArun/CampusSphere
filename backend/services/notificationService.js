const Notification = require("../models/Notification");
const logger = require("../utils/logger");
const { notificationsQueue } = require("../queues");

const SERVICE = "NotificationService";

exports.createNotification = async ({
  recipient,
  type,
  title,
  message,
  link,
  meta,
}) => {
  try {
    // enqueue notification to be written by worker
    const payload = { recipient, type, title, message, link, meta };
    try {
      return await notificationsQueue.add("single", { payload });
    } catch (qerr) {
      // fallback to immediate write if queueing fails
      logger.error(SERVICE, "Queueing notification failed, falling back", {
        error: qerr.message,
      });
      return await Notification.create(payload);
    }
  } catch (err) {
    logger.error(SERVICE, "Failed to create notification", {
      error: err.message,
    });
  }
};

exports.broadcastNotification = async (recipientIds, payload) => {
  try {
    if (!recipientIds?.length) return;
    const docs = recipientIds.map((rid) => ({ recipient: rid, ...payload }));
    try {
      return await notificationsQueue.add("batch", { payload: docs });
    } catch (qerr) {
      logger.error(SERVICE, "Queueing broadcast failed, falling back", {
        error: qerr.message,
      });
      await Notification.insertMany(docs);
      logger.info(SERVICE, "Broadcast sent (direct)", {
        count: recipientIds.length,
      });
    }
  } catch (err) {
    logger.error(SERVICE, "Broadcast failed", { error: err.message });
  }
};

exports.deleteOldNotifications = async () => {
  try {
    const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000);
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoff },
    });
    if (result.deletedCount > 0)
      logger.info(
        SERVICE,
        `Cleanup: deleted ${result.deletedCount} old notifications`,
      );
  } catch (err) {
    logger.error(SERVICE, "Cleanup failed", { error: err.message });
  }
};
