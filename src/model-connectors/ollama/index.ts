import pLimit from 'p-limit';
import axios from 'axios';
import { config } from './config';
import { GetChatCompletion } from '../interface';

const globalRateLimit = pLimit(config.requestConcurrency);

export const getChatCompletion: GetChatCompletion = (messages) => {
  return globalRateLimit(async () => {
    const response = await axios({
      url: `http://${config.host}/api/generate`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        model: config.model,
        prompt: messages.map((m) => m.content).join('\n\n'),
        stream: false,
        options: {
          num_predict: 1,
        },
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error calling API: got status ${response.status}`);
    }

    return response.data.response;
  });
};
