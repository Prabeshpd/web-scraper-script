import ampqlib, { Channel, Connection } from 'amqplib';

import logger from './logger';

interface ConnectionParameter {
  host: string;
  port: number;
}

interface MessageQueue {
  connection: Connection | null;
  createChannel: (connection: Connection) => void;
  sendMessage: (channel: Channel, queueName: string, message: string) => void;
  bindConnection: (connection: Connection) => void;
}

class RabbitMQueue implements MessageQueue {
  private _connectionParameter: ConnectionParameter;
  public connection: Connection | null;

  constructor(connection: ConnectionParameter) {
    this._connectionParameter = connection;
    this.connection = null;
  }

  async createConnection() {
    if (this.connection) return this.connection;

    const connection = await ampqlib.connect(
      `amqp://${this._connectionParameter.host}:${this._connectionParameter.port}`
    );
    this.bindConnection(connection);

    return connection;
  }

  getConnection() {
    return this.connection;
  }

  bindConnection(connection: Connection) {
    if (this.connection) return;

    logger.info('Binding RabbitMQ connection');
    this.connection = connection;
  }

  async createChannel() {
    if (!this.connection) return;

    const channel = await this.connection.createChannel();

    return channel;
  }

  async assertQueue(channel: Channel, name: string) {
    channel.assertQueue(name);
  }

  async sendMessage(channel: Channel, queueName: string, message: string) {
    channel.sendToQueue(queueName, Buffer.from(message));
  }
}

export default RabbitMQueue;
