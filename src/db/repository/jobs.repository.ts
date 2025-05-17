import { ObjectId } from 'mongodb';
import { JobPosting } from '../../types/types.js';
import { getMongoClient } from '../init/mongodb.js';

export async function isJobIdSeen(jobId: string): Promise<boolean> {
    if (!jobId) return false;
    const { client, db } = await getMongoClient();
    try {
        const jobsCollection = db.collection('jobs');
        const found = await jobsCollection.findOne({ currentJobId: jobId, seen: true });
        return !!found;
    } catch (err) {
        console.error('Error checking jobId in MongoDB:', err);
        return false;
    }
}

export async function getExistingUnProcessedJob(jobId: string): Promise<JobPosting | undefined> {
    const { client, db } = await getMongoClient();
    let found: JobPosting | undefined;
    try {
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.findOne({ currentJobId: jobId, seen: true, processed: false });
        if (result) {
            found = {
                _id: result._id.toString(),
                company: result.company,
                url: result.url,
                description: result.description,
                currentJobId: result.currentJobId,
                seen: result.seen,
                processed: result.processed
            };
        }
    } catch (err) {
        console.error('Error getting existing unprocessed job:', err);
        return undefined;
    }
    return found;
}

export async function getAllUnprocessedJobs(): Promise<JobPosting[]> {
    const { client, db } = await getMongoClient();
    try {
        const jobsCollection = db.collection('jobs');
        const results = await jobsCollection.find({ processed: false }).toArray();
        return results.map(result => ({
            _id: result._id.toString(),
            company: result.company,
            url: result.url,
            description: result.description,
            currentJobId: result.currentJobId,
            seen: result.seen,
            processed: result.processed
        }));
    } catch (err) {
        console.error('Error fetching all unprocessed jobs:', err);
        return [];
    }
}

export async function getAllUnprocessedJobsCount(): Promise<number> {
    const { db } = await getMongoClient();
    let count = 0;
    try {
        const jobsCollection = db.collection('jobs');
        count = await jobsCollection.countDocuments({ seen: true, processed: false });
    } catch (err) {
        console.error('Error fetching all unprocessed jobs count:', err);
    }
    return count;
}

export async function saveJob(job: JobPosting): Promise<JobPosting | undefined> {
    const { client, db } = await getMongoClient();
    try {
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.insertOne({
            _id: new ObjectId(),
            company: job.company,
            url: job.url,
            description: job.description,
            currentJobId: job.currentJobId,
            seen: job.seen,
            processed: job.processed
        });
        const insertedDoc = await jobsCollection.findOne({ _id: result.insertedId });
        return insertedDoc ? {
            _id: insertedDoc._id.toString(),
            company: insertedDoc.company,
            url: insertedDoc.url,
            description: insertedDoc.description,
            currentJobId: insertedDoc.currentJobId,
            seen: insertedDoc.seen,
            processed: insertedDoc.processed
        } : undefined;
    } catch (err) {
        console.error('Error saving job:', err);
    }
    return undefined;
}

export async function markJobProcessed(jobId: string): Promise<number> {
    if (!jobId) {
        console.error('Job ID is required to mark job as processed.');
        return 0;
    }
    const { client, db } = await getMongoClient();
    try {
        const jobsCollection = db.collection('jobs');
        const result = await jobsCollection.updateOne(
            { currentJobId: jobId },
            { $set: { processed: true } }
        );
        return result.modifiedCount;
    } catch (err) {
        console.error('Error marking job as processed:', err);
        return 0;
    }
}