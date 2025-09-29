// Helper function to ensure URL has proper protocol
const ensureProtocol = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`;
  }
  return url;
};

export const config = {
  api: {
    baseURL: ensureProtocol(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tribly.ai'),
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3'),
  },
  app: {
    name: 'Tribly',
    version: process.env.npm_package_version || '1.0.0',
  },
};
