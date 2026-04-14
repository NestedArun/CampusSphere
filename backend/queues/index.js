const Queue = require("bull");
require("dotenv").config();

const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

// Export queues used by the app
const notesQueue = new Queue("notes", redisUrl);
const notificationsQueue = new Queue("notifications", redisUrl);

module.exports = {
  notesQueue,
  notificationsQueue,
};
