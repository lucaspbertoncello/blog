export type HandlerParams<TParams> = {
  body: TParams;
  params: Record<string, unknown>;
  queryParams: Record<string, unknown>;
};

export type HandlerResponse<T = undefined> = {
  body?: T;
  statusCode: number;
};
