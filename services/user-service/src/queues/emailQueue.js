import amqp from 'amqplib';
import logger from '../../../../shared/utils/logger.js';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const USER_EVENTS_EXCHANGE = 'user.events';

let connection;
let channel;

const connectRabbitMQ = async () => {
  if (connection) return channel;
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(USER_EVENTS_EXCHANGE, 'topic', {
      durable: true,
    });
    logger.info('Connected to RabbitMQ for event publishing');
    return channel;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

const publishEvent = async (routingKey, message) => {
  const ch = await connectRabbitMQ();
  ch.publish(
    USER_EVENTS_EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
  logger.info(`Event published: ${routingKey}`);
};

export { publishEvent };
