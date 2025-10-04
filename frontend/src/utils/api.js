// API configuration utility - Extended with image URL handling
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fitby-fitness-ai-powered-app.onrender.com";

export const apiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Remove trailing slash from base URL if it exists
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

// Helper function for image URLs
export const imageUrl = (imagePath) => {
  if (!imagePath) return null;
  return apiUrl(`/uploads/${imagePath}`);
};

export default apiUrl;guration utility
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fitby-fitness-ai-powered-app.onrender.com";

export const apiUrl = (endpoint) => {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Remove trailing slash from base URL if it exists
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${cleanBaseUrl}${cleanEndpoint}`;
};

export default apiUrl;