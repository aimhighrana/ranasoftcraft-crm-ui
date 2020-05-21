// Interface for Task List Row
export interface TaskListRow {
    task_id: string;
    description: string;
    requestor: string;
    recieved_on: string;
    due_date: string;
    module: string;
    priority: string;
    tags: Array<object>;
}