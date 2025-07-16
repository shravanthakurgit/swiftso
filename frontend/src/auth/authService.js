// src/auth/authService.js
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';

export const refreshAccessToken = async () => {

  try {
    const res = await axios.post(`${backendUrl}/api/user/refresh-token`, {
    }, {withCredentials: true});
    return res.data?.accessToken;
  } catch (err) {
   
    return null;
  }
};
