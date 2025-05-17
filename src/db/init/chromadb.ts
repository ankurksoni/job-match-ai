import axios, { AxiosInstance } from 'axios';

const CHROMA_HOST = process.env.CHROMA_HOST || 'http://localhost:8000';

let chromaClient: AxiosInstance | null = null;

export function getChromaClient(): AxiosInstance {
  if (chromaClient) return chromaClient;
  try {
    chromaClient = axios.create({ baseURL: CHROMA_HOST });
    return chromaClient;
  } catch (err) {
    console.error('Failed to initialize ChromaDB client:', err);
    throw err;
  }
} 