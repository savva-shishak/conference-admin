import { Store } from 'pullstate';
import axios from "axios";

export const tokenStore = new Store({ token: localStorage.getItem('admin-token') });

tokenStore.subscribe(({ token }) => {
  if (token) {
    localStorage.setItem('admin-token', token);
  } else {
    localStorage.removeItem('admin-token');
  }
}, () => {})

export const agent = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL });

agent.interceptors.request.use(
  (request) => {
    request.headers = {
      ...(request.headers || {}),
      authorization: tokenStore.getRawState().token,
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
  return await agent.post('/admin/login', { login, password }).then(res => res.data);
}