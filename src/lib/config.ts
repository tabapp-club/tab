export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tabapp.club/v1',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3'),
  },
  app: {
    name: 'Tribly',
    version: process.env.npm_package_version || '1.0.0',
  },
};