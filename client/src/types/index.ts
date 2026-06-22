export interface User {
  id: string;
  username: string;
  email: string;
}

export interface File {
  _id?: string;
  name: string;
  language: string;
  content: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  language: string;
  files: File[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export type AIAction = 'explain' | 'debug' | 'optimize' | 'generate' | 'chat';

export interface AIResponse {
  result?: string;
  reply?: string;
  completion?: string;
  error?: string;
}
