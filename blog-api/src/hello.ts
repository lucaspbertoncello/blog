import { lambdaHttpAdapter } from "./adapters/lambdaHttpAdapter";
import z from "zod";

const schema = z.object({
  hello: z.string(),
});

export const handler = lambdaHttpAdapter<"public", Hello.Response>(
  async () => {
    return { statusCode: 200, body: { success: false } };
  },
  { schema },
);

export namespace Hello {
  export type Params = z.infer<typeof schema>;
  export type Response = { success: boolean };
}
