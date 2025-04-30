// Standard error codes and messages
const ERROR_CODES = {
  AUTH: {
    PERMISSION_DENIED: {
      code: 'AUTH-001',
      message: 'You do not have permission to perform this action'
    },
    NOT_AUTHENTICATED: {
      code: 'AUTH-002', 
      message: 'Please login to continue'
    },
    INVALID_CREDENTIALS: {
      code: 'AUTH-003',
      message: 'Invalid email or password'
    },
    EMAIL_EXISTS: {
      code: 'AUTH-004',
      message: 'Email already in use'
    },
    WEAK_PASSWORD: {
      code: 'AUTH-005',
      message: 'Password should be at least 6 characters'
    },
    TOO_MANY_ATTEMPTS: {
      code: 'AUTH-006',
      message: 'Account temporarily locked - try again later'
    }
  },
  FIRESTORE: {
    DOC_NOT_FOUND: {
      code: 'FIRESTORE-001',
      message: 'Requested document not found'
    },
    QUERY_FAILED: {
      code: 'FIRESTORE-002',
      message: 'Database query failed'
    }
  },
  VALIDATION: {
    INVALID_INPUT: {
      code: 'VALIDATION-001',
      message: 'Invalid input provided'
    }
  }
};

// Central error handler
export const handleError = (error, context = '') => {
  let errorData = {
    code: 'UNKNOWN-001',
    message: 'An unexpected error occurred',
    originalError: error,
    context
  };

  // Handle Firebase errors
  if (error.code && error.code.startsWith('auth/')) {
    errorData = {
      ...ERROR_CODES.AUTH.PERMISSION_DENIED,
      originalError: error
    };
  }

  // Handle known error types
  if (error.code && ERROR_CODES[error.code]) {
    errorData = {
      ...ERROR_CODES[error.code],
      originalError: error
    };
  }

  // Log to console for debugging
  console.error(`[${errorData.code}] ${errorData.message}`, {
    context,
    error: errorData.originalError
  });

  return errorData;
};

// Error boundary component
export const withErrorBoundary = (Component, fallback = null) => {
  return class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      handleError(error, 'ErrorBoundary');
      console.error('Component stack:', errorInfo.componentStack);
    }

    render() {
      if (this.state.hasError) {
        return fallback || <div>Something went wrong</div>;
      }
      return <Component {...this.props} />;
    }
  };
};
