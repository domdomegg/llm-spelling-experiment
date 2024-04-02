export type PromptRole = 'system' | 'user' | 'assistant';
export type Prompt = { role: PromptRole, content: string }[];
export type GetChatCompletion = (prompt: Prompt) => Promise<string>;
export type GetCompletion = (prompt: string) => Promise<string>;
export type GetLogProbs = (prompt: string) => Promise<Record<string, number>>;
