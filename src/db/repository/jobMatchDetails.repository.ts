import { ObjectId } from "mongodb";
import { JobMatchDetails, JobPosting } from "../../types/types";
import { getMongoClient } from "../init/mongodb.js";

export async function saveJobMatchDetails(job: JobMatchDetails): Promise<JobMatchDetails | undefined> {
    const { db } = await getMongoClient();
    try {
        const jobMatchDetailsCollection = db.collection('jobMatchDetails');
        const result = await jobMatchDetailsCollection.insertOne({
            _id: new ObjectId(),
            currentJobId: job.currentJobId,
            matchScore: job.matchScore,
            explanation: job.explanation,
            success: job.success
        });
        const insertedDoc = await jobMatchDetailsCollection.findOne({ _id: result.insertedId });
        return insertedDoc ? {
            _id: insertedDoc._id.toString(),
            currentJobId: insertedDoc.currentJobId,
            matchScore: insertedDoc.matchScore,
            explanation: insertedDoc.explanation,
            success: insertedDoc.success
        } : undefined;
    } catch (err) {
        console.error('Error saving job match details:', err);
    }
    return undefined;
}