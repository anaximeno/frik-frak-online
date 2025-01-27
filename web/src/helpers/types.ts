export interface IPaginatedParams {
  page?: number;
}

export interface IPaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Array<T>;
}
