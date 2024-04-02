import pLimit from 'p-limit';
import axios from 'axios';
import { config } from './config';
import { GetChatCompletion, GetCompletion, GetLogProbs } from '../interface';

const globalRateLimit = pLimit(config.requestConcurrency);

export const getChatCompletion: GetChatCompletion = (messages) => {
  return globalRateLimit(async () => {
    const response = await axios({
      baseURL: config.baseURL,
      url: '/v1/chat/completions',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
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

export const getCompletion: GetCompletion = (prompt) => {
  return globalRateLimit(async () => {
    const response = await axios({
      baseURL: config.baseURL,
      url: '/v1/completions',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        prompt,
        max_tokens: 500,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error calling API: got status ${response.status}`);
    }

    return response.data.choices[0].text;
  });
};

export const getLogProbs: GetLogProbs = (prompt) => {
  return globalRateLimit(async () => {
    const response = await axios({
      baseURL: config.baseURL,
      url: '/v1/completions',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        logprobs: 15,
        prompt,
        max_tokens: 1,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error calling API: got status ${response.status}`);
    }

    return response.data.choices[0].logprobs.top_logprobs[0];
  });
};
