export class SchemaExecutionRequest {
    schemaId: string;
    variantId: string;
    runId: string;
    userId: string;
    platCode: string;
}

/**
 * Interface to schema execution progress
 */
export interface SchemaExecutionProgressResponse {
    schemaId: number;
    percentage: number;
    totalRules: number;
    completedRules: number;
}
