export interface TaskListDataResponse {
  total: number;
  _doc: TaskListData[];
  req_at: number;
  to: number;
  res_at: number;
}

export interface TaskListData {
  Records: string;
  setting: number;
  description: number;
  labels: string[];
  sent: string;
  dueby: string;
  requestby: string;
  sentby: string;
  isImportant?: boolean;
}
