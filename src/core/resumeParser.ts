import fs from 'node:fs';
// @ts-ignore
import pdfParse from 'pdf-parse';
import { Resume } from '../types/types.js';

export async function parseResumePDF(pdfPath: string): Promise<Resume> {
  console.log('pdfPath', pdfPath);
  if (!pdfPath.endsWith('.pdf')) throw new Error('Resume must be a PDF file.');
  if (!fs.existsSync(pdfPath)) throw new Error('Resume PDF not found.');
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    if (!data.text || data.text.trim().length === 0) throw new Error('Failed to extract text from PDF.');
    return { text: data.text };
  } catch (err) {
    console.error('Error parsing resume PDF:', err);
    throw new Error('Could not parse resume PDF.');
  }
} 