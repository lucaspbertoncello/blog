"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/hello.ts
var hello_exports = {};
__export(hello_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(hello_exports);

// src/utils/bodyParser.ts
function bodyParser(body) {
  if (!body) return;
  return JSON.parse(body ?? "");
}

// src/utils/sendResponse.ts
function sendResponse(params) {
  let body = "";
  if (params.body !== void 0) {
    if (typeof params.body === "string") {
      body = params.body;
    } else {
      body = JSON.stringify(params.body);
    }
  }
  return {
    statusCode: params.statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body
  };
}

// src/adapters/lambdaHttpAdapter.ts
function lambdaHttpAdapter(fn) {
  return async (event) => {
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

// src/hello.ts
var handler = lambdaHttpAdapter(async () => {
  return { statusCode: 204, body: { users: false } };
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=hello.js.map
