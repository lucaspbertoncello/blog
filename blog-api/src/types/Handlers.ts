export type HandlerParams<TParams> = {
  body: TParams;
  params: Record<string, unknown>;
  queryParams: Record<string, unknown>;
  accountId?: string | null;
};

export type HandlerResponse<T = undefined> = {
  body?: T;
  statusCode: number;
};
