
export interface JobQueue {
    jobPk: {
        jobId: string;
        status: string;
    };
    initiatedBy: string;
    processType: string;
    startDate: string;
    endDate: string;
    logMessage: string;
    plantCode: string;
}
