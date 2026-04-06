import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { ZodError, ZodType } from "zod";
import { bodyParser } from "../utils/bodyParser";
import { sendResponse } from "../utils/sendResponse";
import { HandlerParams, HandlerResponse } from "../types/Handlers";

type Route = "public" | "private";
type EventType<TRoute extends Route> = TRoute extends "public"
  ? APIGatewayProxyEventV2
  : APIGatewayProxyEventV2WithJWTAuthorizer;

type AdapterFn<TParams, TResponse> = (params: HandlerParams<TParams>) => Promise<HandlerResponse<TResponse>>;

type AdapterOptions = {
  schema?: ZodType;
};

export function lambdaHttpAdapter<TRoute extends Route, TParams = undefined, TResponse = undefined>(
  fn: AdapterFn<TParams, TResponse>,
  options?: AdapterOptions,
) {
  return async (event: EventType<TRoute>): Promise<APIGatewayProxyResultV2> => {
    try {
      const rawBody = bodyParser(event.body);
      const body: TParams = options?.schema ? options.schema.parse(rawBody) : rawBody;
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const result = await fn({ body, params, queryParams });

      return sendResponse({ statusCode: result.statusCode, body: result.body ?? {} });
    } catch (err) {
      if (err instanceof ZodError) {
        return sendResponse({
          statusCode: 422,
          body: { message: "Validation error", errors: err.issues },
        });
      }
      console.error(err);
      return sendResponse({ statusCode: 500, body: { message: "Internal server error" } });
    }
  };
}
