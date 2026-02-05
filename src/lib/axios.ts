import axios from "axios";

const APIInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_ADDR_PROXY_PATH,
  timeout: 10000,
});

export default APIInstance;
