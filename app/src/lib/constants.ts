export const API_URL = 'https://api.example.com';
export const MAX_RESULTS = 50;
export const MAX_SERVER_SIDE_RESULTS = 8;
export const DEFAULT_TIMEOUT = 5000;
export const MINIMUM_MESSAGE_LENGTH = 10;
export const MAXIMUM_MESSAGE_LENGTH = 5000;
export const MINIMUM_TITLE_LENGTH = 4;
export const MAXIMUM_TITLE_LENGTH = 80;
export const PATH = process.env.NEXT_PUBLIC_DB_COLLECTION_PATH || "developmentPosts"
export const DEFAULT_LANGUAGE = 'es';
export const DEFAULT_COLOR = 'blue.4';
export const UNIVERSIDAD = "uninorte"
export const DEFAULT_GRADIENT = { to: 'violet.9', from: DEFAULT_COLOR, deg: 90 }
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
export const POSTHOG_HOST_URL = `https://${appUrl}/ingest` || process.env.NEXT_PUBLIC_POSTHOG_HOST;
// Backend
export const VECTOR_SEARCH_LIMIT = 27
