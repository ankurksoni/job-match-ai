export interface JobPosting {
  _id?: string;
  company: string;
  url: string;
  description: string;
  currentJobId: string;
  seen: boolean;
  processed: boolean;
}

export interface JobMatchDetails {
  _id?: string;
  currentJobId: string;
  matchScore: number;
  explanation: string;
  success: boolean;
}

export interface ScrapedJob {
  company: string;
  url: string;
  matchScore: number;
}

export interface Resume {
  text: string;
}

export interface LLMMatchResult {
  currentJobId: string;
  matchScore: number;
  explanation?: string;
  success: boolean;
}

export interface PersistedJobs {
  [url: string]: ScrapedJob;
} 