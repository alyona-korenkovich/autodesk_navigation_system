export const SALT = 10;
export const SCOPES = {
  // Required scopes for the server-side application
  internal: [
    'bucket:create',
    'bucket:read',
    'data:read',
    'data:create',
    'data:write',
  ],
  // Required scope for the client-side viewer
  public: ['viewables:read'],
};