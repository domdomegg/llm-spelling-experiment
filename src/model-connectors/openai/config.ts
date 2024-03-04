export const config = {
  requestConcurrency: 3,
  apiKey: process.env['MODEL_OPENAI_API_KEY']!,
  organization: process.env['MODEL_OPENAI_ORG']!,
  model: process.env['MODEL_OPENAI_MODEL']!,
};
