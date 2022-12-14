export type FetchMethod = "GET" | "PATCH" | "PUT" | "POST" | "DELETE";

export interface IFetchHeaders {
  [s: string]: string;
}

export interface IFetch {
  endpoint: string;
  method?: FetchMethod;
  headers?: IFetchHeaders;
  body?: any;

  /**
   * Default: 'application/json'
   */
  accept?: string;

  cache?: RequestCache | undefined;

  /**
   * Default: 'application/json'
   */
  contentType?: string;

  // Object of key/value string for passing query parameters
  queryParams?: {
    [name: string]: string | undefined | null | number | boolean;
  };

  /**
   * Whether to stringify the data to JSON, overrides the content type
   */
  stringifyBody?: boolean;
}
const apiURL = "http://localhost:8081";

// converts an object into a query string
// ex: {type : 'Kamelet'} -> &type=Kamelet
function objectToQueryString(obj: { [x: string]: string | undefined | null | number | boolean }) {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

const api = ({
  endpoint,
  method,
  headers = {},
  body,
  cache,
  contentType,
  accept,
  queryParams,
  stringifyBody = true,
}: IFetch) => {
  headers = { ...headers };

  const options: RequestInit = {
    method,
    body: contentType?.includes("application/json") && stringifyBody ? JSON.stringify(body) : body,
    cache: cache ?? "default",
    /**
     * TODO: Omit for now, reassess for prod
     */
    credentials: "omit",
    headers: {
      Accept: accept ?? "application/json,text/plain,text/yaml,*/*",
      "Content-Type": contentType ?? "application/json",
      ...headers,
    },
    mode: "cors",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  // if params exists and method is GET, add query string to url
  // otherwise, add query params as a "body" property to the options object
  if (queryParams && method === "GET") {
    endpoint += "?" + objectToQueryString(queryParams);
  }

  return fetch(`${apiURL}${endpoint}`, options);
};

export default {
  get: (options: IFetch) => api({ method: "GET", ...options }),
  post: (options: IFetch) => api({ method: "POST", ...options }),
  put: (options: IFetch) => api({ method: "PUT", ...options }),
  // patch: (options: IFetch) => api({ method: 'PATCH', ...options }),
  delete: (options: IFetch) => api({ method: "DELETE", ...options }),
};
