import backend from '~backend/client';

export function useBackend() {
  // For now, return the backend client directly
  // In the future, this can be enhanced with authentication
  return backend;
}
