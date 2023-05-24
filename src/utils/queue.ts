import ampqlib, { Channel, Connection } from 'amqplib';

interface ConnectionParameter {
  host: string;
  port: string;
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
    if (this.connection) return;

    this.connection = await ampqlib.connect(
      `ampqlib://${this._connectionParameter.host}:${this._connectionParameter.port}`
    );
  }

  getConnection() {
    return this.connection;
  }

  bindConnection(connection: Connection) {
    if (this.connection) return;

    this.connection = connection;
  }

  async createChannel(connection: Connection) {
    const channel = await connection.createChannel();

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
