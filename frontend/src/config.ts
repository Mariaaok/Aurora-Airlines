const getApiBaseUrl = (): string => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    
    // In Replit, both frontend and backend are proxied through the same domain
    if (hostname.includes('replit.dev') || hostname.includes('repl.co') || hostname.includes('replit.app')) {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
  }
  
  // Local development: backend runs on port 3000
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();
