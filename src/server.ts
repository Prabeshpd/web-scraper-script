import config from './config';
import Queue from './utils/queue';
import { insertSearchResultForUserTags } from './services/searchResult';

interface Message {
  userId: number;
}

const processEnv = config.env;
const connectionParameter = config.rabbitMQ[processEnv];
const queue = new Queue(connectionParameter);

async function startConnection() {
  try {
    const connection = await queue.createConnection();

    queue.bindConnection(connection);
    const channel = await queue.createChannel();

    if (!channel) {
      throw new Error('Rabbit MQ not set properly');
    }

    await queue.assertQueue(channel, 'SearchResult');

    channel.consume('SearchResult', async (message) => {
      if (!message?.content) return;
      const data = await JSON.parse(message?.content.toString()) as Message;
      await insertSearchResultForUserTags(data.userId);
      channel.ack(message);
    });
  } catch (err) {
    console.log(err);
  }
}

startConnection();
