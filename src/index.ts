import 'dotenv/config';
import { loginToLinkedIn } from './core/linkedinLogin.js';
import { scrapeJobs } from './core/jobScraper.js';
import { parseResumePDF } from './core/resumeParser.js';
import { matchResumeToJob } from './core/llmMatcher.js';
import { ScrapedJob } from './types/types.js';
import { getChromiumBrowserPage } from './utility/utils.js';
import { getMongoClient } from './db/init/mongodb.js';
import { getChromaClient } from './db/init/chromadb.js';
import { markJobProcessed } from './db/repository/jobs.repository.js';
import { saveJobMatchDetails } from './db/repository/jobMatchDetails.repository.js';

const linkedinUrl = process.env.LINK || "";
const resumePath = process.env.RESUME_PATH || "";
const linkedinUsername = process.env.LINKEDIN_USERNAME || "";
const linkedinPass = process.env.LINKEDIN_PASS || "";

if (!linkedinUrl || !linkedinUrl.startsWith('https://www.linkedin.com/jobs/')) {
    console.error('Please set LINK in your .env file to a valid LinkedIn job search URL.');
    process.exit(1);
}
if (!resumePath || !resumePath.endsWith('.pdf')) {
    console.error('Please set RESUME_PATH in your .env file to the path of your resume PDF.');
    process.exit(1);
}

async function checkDbConnections() {
    // Check MongoDB
    try {
        await getMongoClient();
        console.log('----> MongoDB connection successful.\n');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
    // Check ChromaDB
    try {
        const chromaClient = getChromaClient();
        // Try a simple GET request to root or /api/v1/heartbeat
        await chromaClient.get('/api/v2/heartbeat');
        console.log('----> ChromaDB connection successful.\n');
    } catch (err) {
        console.error('ChromaDB connection failed:', err);
        process.exit(1);
    }
}

async function startScraping() {
    const { browser, page } = await getChromiumBrowserPage();
    try {
        await loginToLinkedIn(page, linkedinUsername, linkedinPass);

        const jobs = await scrapeJobs(page, linkedinUrl, 50);
        
        return;

        // const resume = await parseResumePDF(resumePath);
        
        // for (const job of jobs) {
        //     const match = await matchResumeToJob(resume, job);

        //     await markJobProcessed(job.currentJobId);

        //     const jobMatchDetails = await saveJobMatchDetails({
        //         currentJobId: job.currentJobId,
        //         matchScore: match.matchScore,
        //         explanation: match.explanation || '',
        //         success: match.success
        //     });

        //     if (jobMatchDetails) {
        //         console.log(`Scored with ${job.company} is ${jobMatchDetails.matchScore}
        //             Reason: ${jobMatchDetails.explanation}`);
        //     } else {
        //         console.log(`Failed to score: ${job.company} (${job.url})`);
        //     }
        // }
    } catch (err) {
        console.error('Fatal error:', err);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

(async () => {
    await checkDbConnections();
    await startScraping();
})();
