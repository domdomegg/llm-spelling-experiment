import pRetry from 'p-retry';
import { EvaluationQuestion } from './dataset-connectors/interface';
import { GetChatCompletion } from './model-connectors/interface';

export const getAnswer = async (getChatCompletion: GetChatCompletion, question: EvaluationQuestion): Promise<string> => {
  return pRetry(async () => {
    const response = (await getChatCompletion([{
      content: question.prompt,
      role: 'system',
    }])).trim().replaceAll('.', '');

    const selectedAnswer = question.choices.find((choice) => response === choice || response.startsWith(`${choice} `));

    if (!selectedAnswer) {
      throw new Error(`Model failed to generate response matching possible choice, got ${response} but expected one of ${question.choices}`);
    }

    return selectedAnswer;
  });
};
