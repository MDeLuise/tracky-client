export const doPost = (
  url: string,
  body: string,
  apiKey?: string
): Promise<Response> => {
  return doFetch(url, "post", body, apiKey);
};

export const doPut = (
  url: string,
  body: string,
  apiKey: string
): Promise<Response> => {
  return doFetch(url, "put", body, apiKey);
};

export const doGet = (url: string, apiKey: string): Promise<Response> => {
  return doFetch(url, "get", undefined, apiKey);
};

export const doDelete = (url: string, apiKey: string): Promise<Response> => {
  return doFetch(url, "delete", undefined, apiKey);
};

const doFetch = (
  url: string,
  method: string,
  body?: string,
  apiKey?: string
): Promise<Response> => {
  let headers = { "Content-Type": "application/json" };
  let options = {
    method: method,
    headers: headers,
  };
  if (body != undefined) {
    options["body"] = body;
  }

  if (url.includes('?')) {
    url += "&key=" + apiKey;
  } else {
    url += "?key=" + apiKey;
  }

  return fetch(url, options);
};