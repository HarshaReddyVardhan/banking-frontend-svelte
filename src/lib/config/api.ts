// ===================================================================
// Banking Frontend - API Configuration
// ===================================================================
// Centralized configuration for backend service communication.
// All requests go through the API Gateway.
// ===================================================================

/**
 * API Configuration for Banking Frontend
 */
export const API_CONFIG = {
    /**
     * API Gateway URL - single entry point for all backend services
     * Override with VITE_API_URL environment variable
     */
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',

    /**
     * WebSocket Gateway URL for real-time updates
     * Override with VITE_WS_URL environment variable
     */
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',

    /**
     * Request timeout in milliseconds
     */
    timeout: 30000,

    /**
     * API endpoints (all routed through API Gateway)
     */
    endpoints: {
        auth: '/auth',
        users: '/users',
        transactions: '/transactions',
        accounts: '/accounts',
        notifications: '/notifications',
        reports: '/reports',
        fraud: '/fraud',
        aml: '/aml',
        audit: '/audit',
    },

    /**
     * Default headers for API requests
     */
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * Build full URL for an API endpoint
 */
export function buildUrl(endpoint: keyof typeof API_CONFIG.endpoints, path = ''): string {
    return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}${path}`;
}

/**
 * Get WebSocket connection URL with optional path
 */
export function getWsUrl(path = ''): string {
    return `${API_CONFIG.wsUrl}${path}`;
}

export default API_CONFIG;
