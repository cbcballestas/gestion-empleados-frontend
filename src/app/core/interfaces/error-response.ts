export interface HttpErrorResponse {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: Error;
}

export interface Error {
  datetime: string;
  message: string;
  details: string;
  errors?: string[];
}

export interface Headers {
  normalizedNames: NormalizedNames;
  lazyUpdate: null;
}

export interface NormalizedNames {}
