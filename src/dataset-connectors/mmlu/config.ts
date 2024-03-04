import { resolve } from 'path';

export const config = {
  // Download from one of:
  // https://huggingface.co/datasets/cais/mmlu/resolve/main/data.tar?download=true
  // https://people.eecs.berkeley.edu/~hendrycks/data.tar
  //
  // This folder should have dev and test folders within it
  pathToFolder: resolve(process.env['DATASET_MMLU_FOLDER']!),
};
