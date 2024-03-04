import { forEachEvaluationQuestion } from './dataset-connectors/mmlu';
import { getAnswer } from './getAnswer';
import { getChatCompletion } from './model-connectors/ollama';

const main = async () => {
  console.log('Running!');

  await forEachEvaluationQuestion(async (q) => {
    const modelAnswer = await getAnswer(getChatCompletion, q);
    if (modelAnswer === q.answer) {
      console.log(`Correct! (${q.answer})`);
    } else {
      console.log(`Incorrect! (model: ${modelAnswer}, actual: ${q.answer})`);
    }
  });
};

main();
