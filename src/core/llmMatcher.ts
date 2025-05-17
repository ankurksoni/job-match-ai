import 'dotenv/config';
// @ts-ignore
import axios from 'axios';
import { Resume, JobPosting, LLMMatchResult } from '../types/types.js';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

export async function matchResumeToJob(resume: Resume, job: JobPosting): Promise<LLMMatchResult> {
  if (!resume.text || !job.description) throw new Error('Missing resume or job description.');

  const prompt = `You are an expert at matching job description with resume. 
  Given the following resume and job description, rate the match on a scale of 0 to 100 (100 = perfect match).
  The match score should be based on the following criteria:
  - The resume should have the similar skills and experience as the job description.
  Resume:
  ${resume.text}
  Job Description:
  ${job.description}
  Current Job ID:
  ${job.currentJobId}
  Respond with only a JSON object: { "currentJobId": string, "matchScore": number, "explanation": string }`;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: OLLAMA_MODEL,
      prompt,
      stream: false
    });

    // Try to extract JSON from the response
    const text = response.data.response || response.data;
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const result = JSON.parse(match[0]);
      if (typeof result.matchScore === 'number') {
        return { 
          currentJobId: result.currentJobId,
          matchScore: result.matchScore,
          explanation: result.explanation,
          success: true };
      }
    }

    throw new Error('Invalid LLM response format.');
  } catch (err) {

    console.error('Error calling Ollama LLM:', err);
    
    return { currentJobId: job.currentJobId, 
      matchScore: 0, 
      explanation: 'LLM error', 
      success: false 
    };
  }
} 