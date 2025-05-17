import { chromium, ElementHandle } from "playwright";

import { Page } from "playwright";

import { Browser } from "playwright";

import { EMPTY_STRING } from '../constant/constants.js';

export function getQueryParamFromUrl(url: string, param: string): string | undefined {
  if (typeof url !== 'string' || typeof param !== 'string' || !url || !param) return undefined;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get(param) || undefined;
  } catch {
    return undefined;
  }
}

export async function getChromiumBrowserPage() {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();
  return { browser, page };
}

export async function getJobIdFromLink(link: ElementHandle): Promise<{ jobId: string, absoluteJobUrl: string }> {
  const jobUrl = await link.getAttribute('href');

  const absoluteJobUrl = jobUrl && jobUrl.startsWith('http') ? jobUrl : jobUrl ? `https://www.linkedin.com${jobUrl}` : undefined;
  if (!absoluteJobUrl) {
    console.log('Skipping job due to missing URL...');
    return { jobId: EMPTY_STRING, absoluteJobUrl: EMPTY_STRING };
  }

  const jobId = getQueryParamFromUrl(absoluteJobUrl, 'currentJobId') || EMPTY_STRING;
  return { jobId, absoluteJobUrl: absoluteJobUrl };
}