export type HandlerParams = {
  body: Record<string, unknown>;
  params: Record<string, unknown>;
  queryParams: Record<string, unknown>;
};

export type HandlerResponse<T = undefined> = {
  body?: T;
  statusCode: number;
};
