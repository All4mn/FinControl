const STORAGE_TOKEN_KEY = 'fincontrol_token';
const STORAGE_USER_KEY = 'fincontrol_user';

export const saveSession = (token, usuario) => {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
};

export const getToken = () => localStorage.getItem(STORAGE_TOKEN_KEY);

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};
