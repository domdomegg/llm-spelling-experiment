# llm-spelling-experiment

Does bad spelling, punctuation and grammar (SPaG) in prompts reduce large language model (LLM) output quality?

This repository contains the code that tries to answer this question, as part of a small research project into behaviors of LLMs.

The SPaG mistakes explored here are fairly minor, and would be clearly recoverable by a human. They should not make the prompt confusing or ambiguous, because of course with an ambiguous prompt the LLM is likely to perform worse.

> Why might we expect this to be the case?

We might expect bad SPaG in prompts to reduce LLM output quality for a couple of reasons:

**Pre-training correlations:** LLMs are pre-trained to predict the next word on large datasets of internet text. There might be correlations between good SPaG and good outputs following, and poor SPaG text and bad outputs following. The model might have picked these up while training.

NB: Many disabilities such as dyslexia make tasks like spelling a challenge for some people, despite them being equally as intelligent as others. This article is NOT saying that poor SPaG = less intelligent, just that there may be a correlation over all internet text of poor SPaG = lower quality text following.

**Fine-tuning coverage**: After pre-training, LLMs are trained to do well at predicting more specific text, for example to predict text that a helpful chat assistant would write. Datasets like [Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) or [Open Assistant](https://huggingface.co/datasets/OpenAssistant/oasst2) are used to do this - but the majority of prompts here are written with good SPaG. This might mean that models don't generalize well to bad SPaG prompts.

> Why is it worth knowing this?

This has practical implications for how we provide prompts to LLMs.

If SPaG is important, then extra care should be taken to spell check prompts before feeding them into LLMs. Adding an extra step to brush up users prompts with another LLM might improve overall performance.

If SPaG is not important, then I can rest happy that I can use assistants while being lazy about my own SPaG without a performance penalty 😅

This project also provides general empirical insight into how current LLMs work, for example how robust they are to minor input perturbations. Additionally, creating this repo can act as a base for other simple empirical work like this in future.

## Further research ideas

* Can you fine tune an open-source LLM to avoid this penalty? For example, if you inject spelling mistakes into prompt datasets, and then fine-tune on this, does performance on misspelled prompts equal that of correctly spelt ones (ideally of the equivalent chat model).

## Running the code

1. Install Git, Node.js, Python and pipenv
2. Clone the repository
3. Install Node.js dependencies with `npm install`
4. Install [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) with `pipenv install`
5. Download [`llama-2-7b.Q4_0.gguf`](https://huggingface.co/TheBloke/Llama-2-7B-GGUF/blob/main/llama-2-7b.Q4_0.gguf)
6. Run the llama-cpp-python server with:
   ```
   export MODEL=~/Downloads/llama-2-7b.Q4_0.gguf
   python3 -m llama_cpp.server --model $MODEL --n_gpu_layers 1
   ```
7. Start with `npm start`

## Contributing

Pull requests are welcomed on GitHub! To get started:

1. Install Git and Node.js
2. Clone the repository
3. Install dependencies with `npm install`
4. Run `npm run test` to run tests
5. Build with `npm run build`
