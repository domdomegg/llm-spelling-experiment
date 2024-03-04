export type EvaluationQuestion = {
  prompt: string,
  answer: string,
  choices: string[],
};

export type EvaluationQuestionProvider = (fn: (q: EvaluationQuestion) => Promise<void>) => Promise<void>;
