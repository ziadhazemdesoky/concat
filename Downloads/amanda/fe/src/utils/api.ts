//utils/api.ts
import axios, { AxiosError } from "axios";
import { UploadResponse } from './types'; 

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-new-access-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      // Handle 401 errors and token refresh here
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post("/refresh-token", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post("/signin", { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Sign in failed");
    }
    throw error;
  }
};

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
) => {
  try {
    const response = await api.post("/signup", {
      firstName,
      lastName,
      email,
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Sign up failed");
    }
    throw error;
  }
};

export const googleSignIn = async (credentialResponse: any) => {
  try {
    const response = await api.post("/auth/google", {
      credential: credentialResponse.credential,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Google sign in failed");
    }
    throw error;
  }
};

export const fetchUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch user data");
    }
    throw error;
  }
};

export const updateUser = async (name: string | null, picture: string | null) => {
  try {
    const response = await api.put("/user", { name, picture });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
    throw error;
  }
};

export const uploadcsvfile = async (
  file: File,
  bankId: number,
  accountType: string,
  transactionType: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bankId", bankId.toString());
    formData.append("accountType", accountType);
    formData.append("transactionType", transactionType);

    console.log("FormData contents:", Array.from(formData.entries()));
    
    const response = await api.post('/upload', formData);
    return response.data;
  } catch (error: any) {
    console.error("Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const validateCSVFile = (file: File): string | null => {
  if (!file) {
    return 'No file selected';
  }

  if (!file.name.toLowerCase().endsWith('.csv')) {
    return 'Only CSV files are allowed';
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return 'File size must be less than 10MB';
  }

  return null;
};


export const googleAcceptInvitationSignIn = async (credentialResponse: any) => {
  try {
    const response = await api.post("/accept_invitation_signup_google", {
      credential: credentialResponse.credential,
    });

    return response.data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const checkOnboardingStatus = async () => {
  try {
    const response = await api.get("/checkonboarding");
    return response.data;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw error;
  }
};

export const plaidSetAccessToken = async (
  publicToken: string,
  metadata: any
) => {
  try {
    const response = await api.post("/set_access_token", {
      public_token: publicToken,
      institution: metadata,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting Plaid access token:", error);
    throw error;
  }
};

export const plaidGetAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching Plaid accounts:", error);
    throw error;
  }
};

export const plaidAccountsSync = async () => {
  try {
    const response = await api.post("/accounts/sync");
    return response.data;
  } catch (error) {
    console.error("Error syncing Plaid accounts:", error);
    throw error;
  }
};

export const plaidDeleteAccount = async (accountId: number) => {
  try {
    const response = await api.delete(`/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Plaid account:", error);
    throw error;
  }
};

// rules api
export const fetchRules = async () => {
  try {
    const response = await api.get("/rules");
    return response.data;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
};

export const deleteRule = async (ruleId: number) => {
  try {
    const response = await api.delete(`/rules/${ruleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting rule:", error);
    throw error;
  }
};

// Invitations api
export const inviteUser = async (data: {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}) => {
  try {
    const response = await api.post("/invitations", data);
    return response.data;
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
};

export const getInvitations = async () => {
  try {
    const response = await api.get("/invitations");
    return response.data;
  } catch (error) {
    console.error("Error fetching invitations:", error);
    throw error;
  }
};

export const getInvitationDetails = async (invitationId: string) => {
  try {
    const response = await api.get(`/invitations/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invitation details:", error);
    throw error;
  }
};

export const getInvitationPublicDetails = async (invitationId: string) => {
  try {
    const response = await api.get(`/invitations_public/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invitation details:", error);
    throw error;
  }
};

export const acceptInvitation = async (invitationId: number) => {
  try {
    const response = await api.post(`/invitations/${invitationId}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

export const rejectInvitation = async (invitationId: number) => {
  try {
    const response = await api.post(`/invitations/${invitationId}/reject`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    throw error;
  }
};

export const acceptInvitationSignup = async (data: {
  invitation_id: string | undefined;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    const response = await api.post(`/accept_invitation_signup`, data);
    return response.data;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

export const getMembers = async () => {
  try {
    const response = await api.get("/members");
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getHouseholdsAdmin = async () => {
  try {
    const response = await api.get("/admin/households");
    return response.data;
  } catch (error) {
    console.error("Error getting households as admin:", error);
    throw error;
  }
};

export default api;
