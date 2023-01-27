import axios from "axios";
import { toast } from "react-toastify"

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

// Register User
export const registerUser = async (userData) => {
    try {
        const Response = await axios.post(`${BACKEND_URL}/api/users/register`, userData, { withCredentials: true })
        if (Response.statusText === "OK") {
            toast.success("Register Succesfully!")
        };
        return Response.data;
    } catch (error) {
        const message = (
            error.Response && error.Response.data && error.Response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }
};

// Login User
export const loginUser = async (userData) => {
    try {
        const Response = await axios.post(`${BACKEND_URL}/api/users/login`, userData, { withCredentials: true })
        if (Response.statusText === "OK") {
            toast.success("Login Succesfully!")
        };
        return Response.data;
    } catch (error) {
        const message = (
            error.Response && error.Response.data && error.Response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }    
};

// Logout User
export const logoutUser = async () => {
    try {
        await axios.get(`${BACKEND_URL}/api/users/logout`, { withCredentials: true })
    } catch (error) {
        const message = (
            error.Response && error.Response.data && error.Response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }    
};

// Forgot Password
export const forgotPassword = async (userData) => {
    try {
        const Response = await axios.post(`${BACKEND_URL}/api/users/forgotpassword`, userData)
        toast.success(Response.data.message)
        return Response.data;
    } catch (error) {
        const message = (
            error.Response && error.Response.data && error.Response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }    
};

// Reset Password
export const resetPassword = async (userData, resetToken) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/users/resetpassword/${resetToken}`,
        userData,
        toast.success("Password reset successfully")
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };