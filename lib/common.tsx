export const doPost = (
  url: string,
  body: string,
  token?: string
): Promise<Response> => {
  return doFetch(url, "post", body, token);
};

export const doGet = (url: string, token: string): Promise<Response> => {
  return doFetch(url, "get", undefined, token);
};

export const doDelete = (url: string, token: string): Promise<Response> => {
  return doFetch(url, "delete", undefined, token);
};

export const refreshToken = (refreshToken: string): Promise<Response> => {
  return doFetch("/refresh", "post", `{refresh_token: ${refreshToken}}`, undefined)
}

const doFetch = (
  url: string,
  method: string,
  body?: string,
  token?: string
): Promise<Response> => {
  let headers = { "Content-Type": "application/json" };
  if (token != undefined) {
    headers["Authorization"] = "Bearer " + token;
  }
  let options = {
    method: method,
    headers: headers,
  };
  if (body != undefined) {
    options["body"] = body;
  }
  return fetch(url, options);
};