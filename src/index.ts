import { appendFile, rename, writeFile } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import Papa from 'papaparse';
import { join } from 'path';
import { forEachEvaluationQuestion, getRecordCount } from './dataset-connectors/mmlu';
import { getAnswerFromLogProbs } from './getAnswer';
import { getLogProbs } from './model-connectors/llama-cpp-python';
import { EvaluationQuestion } from './dataset-connectors/interface';
import { addTypo } from './addTypo';

const outputFile = join('outputs', 'output.csv');

const typoCounts = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256] as const;
type TypoCount = typeof typoCounts[number];

const makeId = (questionId: string, typoCount: TypoCount) => `${questionId}_${typoCount}`;

const appendCsvLine = async ({
  questionId, typoCount, prompt, actualAnswer, givenAnswer, error,
}: {
  questionId: string,
  typoCount: TypoCount,
  prompt: string,
  actualAnswer?: string,
  givenAnswer?: string,
  error?: string
}): Promise<void> => {
  // eslint-disable-next-line no-nested-ternary
  const isCorrect = actualAnswer === givenAnswer ? 'TRUE' : (givenAnswer ? 'FALSE' : '');
  await appendFile(outputFile, `${Papa.unparse([[makeId(questionId, typoCount), questionId, typoCount, prompt, actualAnswer, givenAnswer, isCorrect, error ?? '']])}\n`);
};

const main = async () => {
  const completedIds = await findCompletedIds(outputFile);
  if (completedIds.size === 0) {
    console.log('Did not find any valid output, creating new output file');
    if (existsSync(outputFile)) {
      console.log('Saving previous output.csv to output.csv.bak');
      await rename(outputFile, `${outputFile}.bak`);
    }
    await writeFile(outputFile, 'id,question_id,typoCount,prompt,answer,chosen,isCorrect,error\n');
  } else {
    console.log(`Found ${completedIds.size} results already, continuing from where we left off`);
  }

  let count = completedIds.size;
  let lastUpdate = new Date();
  const total = getRecordCount() * typoCounts.length;
  const updateFrequency = 1;
  await forEachEvaluationQuestion(async (q) => {
    await Promise.all(typoCounts.map(async (typos) => {
      if (completedIds.has(makeId(q.id, typos))) {
        // skip: already run
        return;
      }
      await runQuestion(addTypos(q, typos), typos);
      count += 1;
      if (count % updateFrequency === 0 || count === total) {
        console.log(`[${new Date().toISOString()}] Completed ${count}/${total} (${(100 * (count / total)).toFixed(2)}%) prompts (each: ${((Date.now() - lastUpdate.getTime()) / 1000) / updateFrequency} seconds)`);
        lastUpdate = new Date();
      }
    }));
  });
};

const runQuestion = async (q: EvaluationQuestion, typoCount: TypoCount) => {
  try {
    const givenAnswer = await getAnswerFromLogProbs(getLogProbs, q);
    await appendCsvLine({
      questionId: q.id, typoCount, prompt: q.prompt, actualAnswer: q.answer, givenAnswer,
    });
  } catch (err) {
    console.error(makeId(q.id, typoCount), err);
    await appendCsvLine({
      questionId: q.id, typoCount, prompt: q.prompt, actualAnswer: q.answer, error: err instanceof Error ? err.message : String(err),
    });
  }
};

const addTypos = (q: EvaluationQuestion, typos: TypoCount): EvaluationQuestion => {
  let promptWithTypos = q.prompt;
  for (let i = 0; i < typos; i++) {
    promptWithTypos = addTypo(promptWithTypos);
  }

  return {
    ...q,
    prompt: promptWithTypos,
  };
};

const findCompletedIds = async (file: string): Promise<Set<string>> => {
  const set = new Set<string>();
  await new Promise<void>((resolve) => {
    Papa.parse<{ id?: unknown }>(createReadStream(file), {
      header: true,
      step: (result) => {
        const { id } = result.data;
        if (typeof id === 'string' && id.length > 0) {
          set.add(id);
        }
      },
      complete: () => resolve(),
    });
  });
  return set;
};

main();
