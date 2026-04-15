export type HandlerParams<TBody> = {
  body: TBody;
  params: Record<string, unknown>;
  queryParams: Record<string, unknown>;
  accountId?: string | null;
  role?: string | null;
};

export type HandlerResponse<T = undefined> = {
  body?: T;
  statusCode: number;
};
