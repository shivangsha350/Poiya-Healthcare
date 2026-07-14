// Centralized API and backend configuration
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Automatically connect to localhost if running in local development
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
  ) {
    return 'http://localhost:5000/api';
  }
  // Default Render production backend API URL
  return 'https://poiya-healthcare.onrender.com/api';
};

export const API_BASE_URL = getApiUrl();
// Extract the backend base URL (without /api at the end) to use for static file uploads/previews
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
