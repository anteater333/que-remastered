import axios from "axios";

export const API_SERVER_BASE_URL = import.meta.env
  .VITE_API_SERVER_ADDR_PROXY_PATH;

const APIInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_ADDR_PROXY_PATH,
  timeout: 10000,
});

export default APIInstance;
