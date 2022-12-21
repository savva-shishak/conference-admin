import axios from "axios";

export const agent = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL });
