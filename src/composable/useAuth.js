import axios from 'axios'

const apiUrl = import.meta.env.VITE_BACKEND_API_URL

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function getAuthToken() {
  return getCookie('token');
}

export async function isAuthenticated() {
  try {
    const res = await axios.get('/auth/validate', { withCredentials: true })
    return res.data.authenticated === true
  } catch (error) {
    return false
  }
}

export async function logout() {
  try {
    await axios.post('/auth/logout', {}, { withCredentials: true })
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
