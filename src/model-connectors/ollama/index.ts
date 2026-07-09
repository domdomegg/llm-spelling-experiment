import pLimit from 'p-limit';
import axios from 'axios';
import {config} from './config';
import {type GetChatCompletion, type GetCompletion} from '../interface';

const globalRateLimit = pLimit(config.requestConcurrency);

export const getChatCompletion: GetChatCompletion = async (messages) => {
	return globalRateLimit(async () => {
		const response = await axios({
			baseURL: config.baseURL,
			url: '/api/chat',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				model: config.model,
				messages,
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

export const getCompletion: GetCompletion = async (prompt) => {
	return globalRateLimit(async () => {
		const response = await axios({
			baseURL: config.baseURL,
			url: '/api/generate',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				model: config.model,
				prompt,
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
