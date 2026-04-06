import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { bodyParser } from "../utils/bodyParser";
import { sendResponse } from "../utils/sendResponse";
import { HandlerParams, HandlerResponse } from "../types/Handlers";

type Route = "public" | "private";
type EventType<TRoute extends Route> = TRoute extends "public"
  ? APIGatewayProxyEventV2
  : APIGatewayProxyEventV2WithJWTAuthorizer;

type AdapterFn<TBody> = (params: HandlerParams) => Promise<HandlerResponse<TBody>>;

export function lambdaHttpAdapter<TRoute extends Route, TBody = undefined>(fn: AdapterFn<TBody>) {
  return async (event: EventType<TRoute>): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = bodyParser(event.body);
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const result = await fn({ body, params, queryParams });

      return sendResponse({ statusCode: result.statusCode, body: result.body ?? {} });
    } catch (err) {
      console.error(err);
      return sendResponse({ statusCode: 500, body: { message: "Internal server error" } });
    }
  };
}
