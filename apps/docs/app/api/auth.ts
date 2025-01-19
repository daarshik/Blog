import axios from "axios";
import useAuthStore from "../utils/useAuthStore";

const BASEURL = "http://localhost:8000";

// User data type
type userData = {
  email: string | null;
  name: string | null;
  photoURL: string | null;
};

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = useAuthStore.getState().token
      ? `Bearer ${useAuthStore.getState().token}`
      : "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.data.accessToken;
    console.log(response);

    if (newToken) {
      useAuthStore.getState().setToken(newToken);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request a new access token
        const res = await axios.get(
          `${BASEURL}/auth/refresh`,

          { withCredentials: true }
        );
        const newToken = res.data.accessToken;

        if (newToken) {
          useAuthStore.getState().setToken(newToken);
        }
        // Retry the failed request with new token
        originalRequest.headers["Authorization"] =
          `Bearer ${useAuthStore.getState().token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Optional: Redirect to login on refresh failure
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Login function
export const login = async ({ idToken }: any) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      // email,
      // name,
      // photoURL,
      idToken,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get("/auth");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blogs");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    await axiosInstance.get("/auth/logout");
  } catch (error) {
    console.log(error);
  }
};
