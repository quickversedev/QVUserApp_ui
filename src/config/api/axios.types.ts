import { InternalAxiosRequestConfig } from 'axios';

export interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

export interface ApiError {
  status: number;
  message: string;
  isCancelled?: boolean;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}
