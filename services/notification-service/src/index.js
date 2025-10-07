import amqp from 'amqplib';
import dotenv from 'dotenv';
import logger from '../../../shared/utils/logger.js';
import { sendInvitationEmail } from './services/Mailer.js';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const USER_EVENTS_EXCHANGE = 'user.events';

async function start() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(USER_EVENTS_EXCHANGE, 'topic', {
      durable: true,
    });
    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, USER_EVENTS_EXCHANGE, 'invitation.created');

    logger.info(
      `Connected to RabbitMQ, waiting for messages in exchange: ${USER_EVENTS_EXCHANGE}`
    );

    channel.consume(
      queue,
      async msg => {
        if (msg !== null) {
          try {
            const event = JSON.parse(msg.content.toString());
            logger.info('Received event', { event });

            const { email, token, tempPassword, authType, invitationId } =
              event;
            await sendInvitationEmail({
              to: email,
              token,
              tempPassword,
              authType,
            });
            channel.ack(msg);
            logger.info('Event processed and acknowledged', { invitationId });
          } catch (err) {
            logger.error('Error processing event', {
              error: err.message,
              stack: err.stack,
            });
            channel.nack(msg, false, false); // Do not requeue
          }
        }
      },
      { noAck: false }
    );

    process.on('SIGINT', async () => {
      logger.info('Shutting down notification service...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (err) {
    logger.error('Failed to start notification service', {
      error: err.message,
    });
    process.exit(1);
  }
}

start();
