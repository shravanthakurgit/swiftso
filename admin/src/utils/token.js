import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    return null;
  }
};
