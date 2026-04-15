export type HandlerParams<
  TBody extends Record<string, any> | undefined = undefined,
  TParams extends Record<string, any> | undefined = undefined,
  TQueryParams extends Record<string, any> | undefined = undefined,
> = {
  body: TBody;
  params: TParams;
  queryParams: TQueryParams;
  accountId?: string | null;
  role?: string | null;
};

export type HandlerResponse<T = undefined> = {
  body?: T;
  statusCode: number;
};
