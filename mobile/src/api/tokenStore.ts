import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "students_traffic_mobile_token";
let memoryToken: string | null = null;
const tokenListeners = new Set<(token: string | null) => void>();

function canUseLocalStorage() {
  return typeof localStorage !== "undefined";
}

export async function getToken() {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    memoryToken = canUseLocalStorage() ? localStorage.getItem(TOKEN_KEY) : null;
  }
  return memoryToken;
}

export async function setToken(token: string) {
  memoryToken = token;
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    if (canUseLocalStorage()) localStorage.setItem(TOKEN_KEY, token);
  }
  tokenListeners.forEach((listener) => listener(token));
}

export async function clearToken() {
  memoryToken = null;
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    if (canUseLocalStorage()) localStorage.removeItem(TOKEN_KEY);
  }
  tokenListeners.forEach((listener) => listener(null));
}

export function subscribeToToken(listener: (token: string | null) => void) {
  tokenListeners.add(listener);
  return () => tokenListeners.delete(listener);
}
