let token = null;

export function getAccessToken() {
  return token;
}

export function setAccessToken(newToken) {
  token = newToken;
}

export function removeAccessToken() {
  token = null;
}
