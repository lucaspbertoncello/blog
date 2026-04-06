type ResponseParams = {
  statusCode: number;
  body?: Record<string, any>;
};

export function sendResponse(params: ResponseParams) {
  let body = "";
  if (params.body !== undefined) {
    if (typeof params.body === "string") {
      body = params.body;
    } else {
      body = JSON.stringify(params.body);
    }
  }

  return {
    statusCode: params.statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
}
