export type EvaluationQuestion = {
  id: string,
  prompt: string,
  answer: string,
  choices: string[],
};

export type EvaluationQuestionProvider = (fn: (q: EvaluationQuestion) => Promise<void>) => Promise<void>;
