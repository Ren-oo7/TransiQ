export function getTransiqAppLoginUrl() {
  return process.env.TRANSIQ_APP_LOGIN_URL?.trim() || "/login";
}

