const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  
  error: (message: string, error?: any) => {
    // Always log errors, but sanitize in production
    if (isProd) {
      // In production, log minimal info and avoid exposing sensitive data
      console.error(`[ERROR] ${message}`);
      // Optionally send to error tracking service here
    } else {
      console.error(`[ERROR] ${message}`, error);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  }
}; 