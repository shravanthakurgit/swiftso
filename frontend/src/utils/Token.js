import { jwtDecode } from "jwt-decode";

export const token = localStorage.getItem("accessToken")

const getCurrentUserId = () => {
  const token =
    localStorage.getItem("accessToken")

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded._id || decoded.userId; // depends on your backend
  } catch (err) {
    return null;
  }
};


export const currentUserId = getCurrentUserId();
