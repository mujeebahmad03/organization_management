import { API_CONFIG } from "./constants";

const API_URL = API_CONFIG.REST_URL;

export interface RegisterInput {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const restClient = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Invalid credentials");
    }

    return response.json();
  },
};
