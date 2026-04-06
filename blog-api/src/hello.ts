import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sendResponse } from "./utils/sendResponse";
import { lambdaHttpAdapter } from "./adapters/lambdaHttpAdapter";

type Test = {
  users: boolean;
};

export const handler = lambdaHttpAdapter<"public", Test>(async () => {
  return { statusCode: 204, body: { users: false } };
});
