import Papa from 'papaparse';
import { createReadStream, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { EvaluationQuestionProvider } from '../interface';
import { config } from './config';

export const getRecordCount = () => 14042;

export const forEachEvaluationQuestion: EvaluationQuestionProvider = async (fn) => {
  const devFolder = join(config.pathToFolder, 'dev');
  const testFolder = join(config.pathToFolder, 'test');

  const devCsvFilenames = readdirSync(devFolder).filter((f) => f.endsWith('.csv'));
  const testCsvFilenames = readdirSync(testFolder).filter((f) => f.endsWith('.csv'));

  const inTestButMissingDev = testCsvFilenames.filter((t) => !devCsvFilenames.find((d) => getSubjectName(d) === getSubjectName(t)));
  if (inTestButMissingDev.length > 0) {
    throw new Error(`Found test file ${inTestButMissingDev[0]} but no corresponding dev file`);
  }

  return Promise.all(testCsvFilenames.map(async (testCsvFilename) => {
    const subject = getSubjectName(testCsvFilename);
    const devCsvFilename = devCsvFilenames.find((d) => getSubjectName(d) === subject);

    const { data: devRecords } = Papa.parse<string[]>(readFileSync(join(devFolder, devCsvFilename!), { encoding: 'utf-8' }));

    let count = 0;
    const promises: Promise<void>[] = [];
    await new Promise<void>((resolve) => {
      Papa.parse<string[]>(createReadStream(join(testFolder, testCsvFilename)), {
        step: (result) => {
          const questionId = `${subject.replaceAll(' ', '_')}_${count}`;
          count += 1;
          const task = parseRecord(result.data);
          promises.push(fn({
            id: questionId,
            prompt: `The following are multiple choice questions (with answers) about ${subject}.

${devRecords.slice(0, 5).map(parseRecord).map(stringifyTask).join('\n\n')}

${stringifyTask({ ...task, answer: undefined })}`,
            choices: ['A', 'B', 'C', 'D'],
            answer: task.answer,
          }));
        },
        complete: () => resolve(),
      });
    });
    return Promise.all(promises);
  })).then(() => {});
};

/** @example "high_school_physics_dev.csv" -> "high school physics" */
const getSubjectName = (csvFilename: string): string => csvFilename.replaceAll(/(dev|test)\.csv$/g, '').replaceAll(/[-_]/g, ' ').replaceAll(/\s+/g, ' ').trim();

interface MMLUTask {
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  answer: 'A' | 'B' | 'C' | 'D',
}

const parseRecord = (record: string[]): MMLUTask => {
  const [question, optionA, optionB, optionC, optionD, answer] = record;
  if (!question || !optionA || !optionB || !optionC || !optionD || !answer) {
    throw new Error('Invalid evaluation question');
  }
  if (answer !== 'A' && answer !== 'B' && answer !== 'C' && answer !== 'D') {
    throw new Error(`Invalid answer for MMLU question: ${answer}`);
  }
  return {
    question, optionA, optionB, optionC, optionD, answer,
  };
};

// Tries to match format of HELM
const stringifyTask = (task: Omit<MMLUTask, 'answer'> & { answer: MMLUTask['answer'] | undefined }): string => `Question: ${task.question}
A. ${task.optionA}
B. ${task.optionB}
C. ${task.optionC}
D. ${task.optionD}
Answer: ${task.answer ?? ''}`;
