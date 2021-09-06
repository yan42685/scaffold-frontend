import { cookies } from "./basic-lib";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "userRole";

export function getAccessToken(): string {
    const token = cookies.get(ACCESS_TOKEN_KEY);
    return token ? token : "";
}

export function saveAccessToken(token: string) {
    cookies.set(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string {
    const token = cookies.get(REFRESH_TOKEN_KEY);
    return token ? token : "";
}

export function saveRefreshToken(token: string) {
    cookies.set(REFRESH_TOKEN_KEY, token);
}

export function getRole(): string {
    const role = cookies.get(ROLE_KEY);
    return role ? role : "";
}

export function saveRole(role: string) {
    cookies.set(ROLE_KEY, role);
}
