const getApiBaseUrl = (): string => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    
    if (hostname.includes('replit.dev') || hostname.includes('repl.co') || hostname.includes('replit.app')) {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
  }
  
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
