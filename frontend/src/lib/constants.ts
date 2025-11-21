// API Configuration
export const API_CONFIG = {
  GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
  REST_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
} as const;

// Cookie Configuration
export const COOKIE_CONFIG = {
  AUTH_TOKEN: "authToken",
  USER: "user",
  EXPIRES_DAYS: 7,
} as const;

// Routes
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DEPARTMENTS: "/dashboard/departments",
  SUB_DEPARTMENTS: "/dashboard/sub-departments",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed. Please try again.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  UNAUTHORIZED: "Unauthorized access. Please login again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DEPARTMENT_CREATED: "Department created successfully",
  DEPARTMENT_UPDATED: "Department updated successfully",
  DEPARTMENT_DELETED: "Department deleted successfully",
  SUB_DEPARTMENT_CREATED: "Sub-department created successfully",
  SUB_DEPARTMENT_UPDATED: "Sub-department updated successfully",
  SUB_DEPARTMENT_DELETED: "Sub-department deleted successfully",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  LOADING_SPINNER_SIZE: {
    SM: "h-8 w-8",
    MD: "h-12 w-12",
    LG: "h-16 w-16",
  },
  LOADING_SPINNER_COLOR: "border-blue-600",
} as const;

// Confirmation Messages
export const CONFIRM_MESSAGES = {
  DELETE_DEPARTMENT: "Are you sure you want to delete this department? This will also delete all sub-departments.",
  DELETE_SUB_DEPARTMENT: "Are you sure you want to delete this sub-department?",
} as const;

