import { Store } from 'pullstate';
import axios from "axios";

export const agent = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL });

agent.interceptors.request.use(
  (request) => {
    request.headers = {
      ...(request.headers || {}),
      authorization: localStorage.getItem('admin-token'),
    };

    return request;
  }
);

agent.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401) {
      window.location.href = '/login';
    }

    throw error;
  }
)

export async function login(login: string, password: string) {
  await agent.post('/admin/login', { login, password })
    .then(res => localStorage.setItem('admin-token', res.data));  
}