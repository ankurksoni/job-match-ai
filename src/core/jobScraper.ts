import { Page } from 'playwright';
import { JobPosting } from '../types/types.js';
import { getJobIdFromLink as extractJobDetailsFromLink } from '../utility/utils.js';
import { getExistingUnProcessedJob as getUnProcessedJob, isJobIdSeen, saveJob, getAllUnprocessedJobs, getAllUnprocessedJobsCount } from '../db/repository/jobs.repository.js';
import {
  JOB_CARD_LINK_SELECTOR,
  JOB_COMPANY_SELECTOR,
  JOB_DESCRIPTION_XPATH,
  NOT_APPLICABLE
} from '../constant/constants.js';

export async function scrapeJobs(page: Page, url: string, limit: number): Promise<JobPosting[]> {

  let savedCount = await getAllUnprocessedJobsCount();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector(JOB_CARD_LINK_SELECTOR, { timeout: 20000 }); // 20 seconds

  let scrollTries = 0;

  while (savedCount < limit && scrollTries < 10) {
    const jobLinks = await page.$$(JOB_CARD_LINK_SELECTOR);

    for (const link of jobLinks) {
      if (savedCount >= limit) {
        break;
      }
      try {
        const { jobId, absoluteJobUrl } = await extractJobDetailsFromLink(link);

        if (!jobId || !absoluteJobUrl) {
          console.log('Skipping job due to missing job ID...');
          continue;
        }

        const unProcessedJob = await getUnProcessedJob(jobId);
        if (unProcessedJob && unProcessedJob.currentJobId === jobId) {
          continue;
        }

        const isJobSeen = await isJobIdSeen(jobId);
        if (isJobSeen) {
          console.log(`Skipping job: ${jobId} due to already seen...`);
          continue;
        } else {
          console.log(`Job: ${jobId} is not seen...`);
        }

        await link.click();

        await page.waitForTimeout(1000 + Math.random() * 1000);

        const company = await page.locator(JOB_COMPANY_SELECTOR).first().textContent() || NOT_APPLICABLE;

        const description = await page.locator(JOB_DESCRIPTION_XPATH).first().textContent() || NOT_APPLICABLE;

        const jobData = {
          company: company.trim(),
          url: absoluteJobUrl,
          description: description.trim(),
          currentJobId: jobId,
          seen: true,
          processed: false,
        };

        console.log('Job data:', jobData);

        const record = await saveJob(jobData);
        if (record) {
          savedCount++;
        }

      } catch (err) {
        console.error('Error scraping job:', err);
        continue;
      }
    }

    if (savedCount < limit) {
      await page.evaluate(() => {
        // Try common LinkedIn job list containers
        const container =
          document.querySelector('.jobs-search-results-list') ||
          document.querySelector('.jobs-search__results-list') ||
          document.querySelector('[data-testid="jobs-search-results-list"]');
        if (container) {
          container.scrollBy(0, 500); // or container.scrollTop += 500;
        } else {
          window.scrollBy(0, window.innerHeight);
        }
      });
      await page.waitForTimeout(2000);
      scrollTries++;
    }
  }

  const allUnprocessedJobs = await getAllUnprocessedJobs();
  console.log('All unprocessed jobs count:', allUnprocessedJobs.length);
  // Fetch all unprocessed jobs from DB to return
  return allUnprocessedJobs;
}