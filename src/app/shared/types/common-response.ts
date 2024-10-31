export interface CommonResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  body: T;
}

export interface CommonResponseAdmin<T> {
  status: number;
  flag: boolean;
  message: string;
  data: T;
  page_data?: PageData;
}

export interface PageData {
  page: number;
  limit: number;
  total: number;
}
