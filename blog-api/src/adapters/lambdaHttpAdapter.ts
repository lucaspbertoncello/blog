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

type Route = "public" | "private";
type EventType<TRoute extends Route> = TRoute extends "public"
  ? APIGatewayProxyEventV2
  : APIGatewayProxyEventV2WithJWTAuthorizer;

type AdapterFn<TBody, TResponse> = (params: HandlerParams<TBody>) => Promise<HandlerResponse<TResponse>>;

type AdapterOptions = {
  schema?: ZodType;
  errorMapper?: (err: unknown) => ApplicationError;
  requiredRoles?: Role[];
};

export function lambdaHttpAdapter<TRoute extends Route, TBody = undefined, TResponse = undefined>(
  fn: AdapterFn<TBody, TResponse>,
  options?: AdapterOptions,
) {
  return async (event: EventType<TRoute>): Promise<APIGatewayProxyResultV2> => {
    try {
      const rawBody = bodyParser(event.body);
      const body: TBody = options?.schema ? options.schema.parse(rawBody) : rawBody;

      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

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

      const result = await fn({ body, params, queryParams, accountId, role });

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
