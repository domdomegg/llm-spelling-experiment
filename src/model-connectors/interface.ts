export type PromptRole = 'system' | 'user' | 'assistant';
export type Prompt = { role: PromptRole, content: string }[];
export type GetChatCompletion = (prompt: Prompt) => Promise<string>;
