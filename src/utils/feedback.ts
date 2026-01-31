type AlertColor = 'error' | 'warning' | 'info' | 'success';

let toastHelper: ((message: string, severity: AlertColor) => void) | null = null;

// Helper to inject the toast function
export const setToastHelper = (fn: (message: string, severity: AlertColor) => void) => {
  toastHelper = fn;
};

export const showFeedback = (type: string, message: string) => {
  // Map old feedback types to toast severity
  const severityMap: Record<string, AlertColor> = {
    'Error': 'error',
    'Success': 'success',
    'Info': 'info',
    'Warning': 'warning',
  };

  const severity = severityMap[type] || 'info';

  if (toastHelper) {
    toastHelper(message, severity);
  } else {
    // Fallback to console if toast helper not available
    console.log(`[${type}] ${message}`);
  }
};
