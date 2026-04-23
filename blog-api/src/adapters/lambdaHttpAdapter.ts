import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { ZodError, ZodType } from "zod";
import { bodyParser } from "../utils/bodyParser";
import { sendResponse } from "../utils/sendResponse";
import { HandlerParams, HandlerResponse } from "../types/Handlers";
import { ApplicationError } from "../errors/ApplicationError";
import { Role } from "../types/Roles";

export function lambdaHttpAdapter<
  TRoute extends LambdaHttpAdapter.Route,
  TBody extends Record<string, any> | undefined = undefined,
  TResponse = undefined,
  TParams extends Record<string, any> | undefined = undefined,
  TQueryParams extends Record<string, any> | undefined = undefined,
>(
  fn: LambdaHttpAdapter.AdapterFn<TBody, TParams, TQueryParams, TResponse>,
  options?: LambdaHttpAdapter.AdapterOptions,
) {
  return async (event: LambdaHttpAdapter.EventType<TRoute>): Promise<APIGatewayProxyResultV2> => {
    try {
      const rawBody = bodyParser(event.body);
      const body: TBody = options?.schema ? options.schema.parse(rawBody) : rawBody;

      const params = event.pathParameters as TParams;

      const rawQueryParams = event.queryStringParameters as TQueryParams;
      const queryParams = options?.querySchema
        ? options.querySchema.parse(rawQueryParams)
        : (rawQueryParams as TQueryParams);

      const accountId =
        "authorizer" in event.requestContext
          ? (event.requestContext.authorizer.jwt.claims.sub as string)
          : null;

      const role =
        "authorizer" in event.requestContext
          ? ((event.requestContext.authorizer.jwt.claims["role"] as string) ?? null)
          : null;

      if (options?.requiredRoles?.length) {
        if (!role || !options.requiredRoles.includes(role as Role)) {
          return sendResponse({ statusCode: 403, body: { message: "Acesso negado" } });
        }
      }

      const result = await fn({
        body,
        params,
        queryParams: queryParams as TQueryParams,
        accountId,
        role,
      });

      return sendResponse({ statusCode: result.statusCode, body: result.body ?? {} });
    } catch (err) {
      if (err instanceof ZodError) {
        return sendResponse({
          statusCode: 422,
          body: { message: "Erro de validação", errors: err.issues },
        });
      }

      if (err instanceof ApplicationError) {
        return sendResponse({ statusCode: 400, body: { message: err.message } });
      }

      if (options?.errorMapper) {
        const mappedError = options.errorMapper(err);
        return sendResponse({ statusCode: 400, body: { message: mappedError.message } });
      }

      console.error(err);
      return sendResponse({ statusCode: 500, body: { message: "Erro interno do servidor" } });
    }
  };
}

export namespace LambdaHttpAdapter {
  export type Route = "public" | "private";
  export type EventType<TRoute extends Route> = TRoute extends "public"
    ? APIGatewayProxyEventV2
    : APIGatewayProxyEventV2WithJWTAuthorizer;

  export type AdapterFn<
    TBody extends Record<string, any> | undefined,
    TParams extends Record<string, any> | undefined,
    TQueryParams extends Record<string, any> | undefined,
    TResponse,
  > = (params: HandlerParams<TBody, TParams, TQueryParams>) => Promise<HandlerResponse<TResponse>>;

  export type AdapterOptions = {
    schema?: ZodType;
    querySchema?: ZodType;
    errorMapper?: (err: unknown) => ApplicationError;
    requiredRoles?: Role[];
  };
}
