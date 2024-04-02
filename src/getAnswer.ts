import pRetry from 'p-retry';
import { EvaluationQuestion } from './dataset-connectors/interface';
import { GetCompletion, GetLogProbs } from './model-connectors/interface';

export const getAnswerFromCompletion = async (getCompletion: GetCompletion, question: EvaluationQuestion): Promise<string> => {
  return pRetry(async () => {
    const response = (await getCompletion(question.prompt)).trim().replaceAll('.', '');

    const selectedAnswer = question.choices.find((choice) => response === choice || response.startsWith(`${choice} `));

    if (!selectedAnswer) {
      throw new Error(`Model failed to generate response matching possible choice, got ${response} but expected one of ${question.choices}`);
    }

    return selectedAnswer;
  });
};

export const getAnswerFromLogProbs = async (getLogProbs: GetLogProbs, question: EvaluationQuestion): Promise<string> => {
  return pRetry(async () => {
    const tokens = Object.entries(await getLogProbs(question.prompt)).sort((a, b) => b[1] - a[1]).map(([token]) => token.trim());
    const selectedAnswer = tokens.find((token) => question.choices.includes(token));

    if (!selectedAnswer) {
      throw new pRetry.AbortError('Model failed to generate log prob matching possible choice');
    }

    return selectedAnswer;
  });
};
