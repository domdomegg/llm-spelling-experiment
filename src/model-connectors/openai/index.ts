import pLimit from 'p-limit';
import axios from 'axios';
import { config } from './config';
import { GetChatCompletion } from '../interface';

const globalRateLimit = pLimit(config.requestConcurrency);

export const getChatCompletion: GetChatCompletion = (messages) => {
  return globalRateLimit(async () => {
    const response = await axios({
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'OpenAI-Organization': config.organization,
      },
      data: {
        model: config.model,
        messages,
        max_tokens: 500,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error calling API: got status ${response.status}`);
    }

    return response.data.choices[0].message.content;
  });
};
