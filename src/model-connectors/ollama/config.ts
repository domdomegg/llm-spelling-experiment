export const config = {
  requestConcurrency: 3,
  baseURL: 'http://localhost:11434',
  model: process.env['MODEL_OLLAMA_MODEL']!,
};
