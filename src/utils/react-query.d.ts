import type { ApiException } from './types';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiException;
  }
}
