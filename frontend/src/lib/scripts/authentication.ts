import { writable, type Writable } from "svelte/store";
import { apiFetch } from "./apiFetch";
import type { UserData } from "common/models/user";
import type { CredentialsLoginResponse, TokenLoginResponse } from "common/models/responseTypes";
import type { AccessTokenRequest, Credentials } from "common/models/requestTypes";

export interface AuthState {
    userData: UserData;
    accessToken: string;
    refreshToken: string;
}

export const authStore: Writable<AuthState | "LOGGED_OUT" | "LOADING"> = writable("LOADING");

export function logout() {
    authStore.set("LOGGED_OUT");
    removeRefreshToken();
}

export async function tryLoginFromCookie() {
    const refreshToken = getRefreshToken();

    if (refreshToken === '') return;

    const refResp = await apiFetch<TokenLoginResponse, AccessTokenRequest>('/api/token', 'POST', { refreshToken });

    if ('status' in refResp) {
        authStore.set("LOGGED_OUT");
        return;
    }

    authStore.set({ ...refResp, refreshToken });
}

export async function login(username: string, password: string) {
    const resp = await apiFetch<CredentialsLoginResponse, Credentials>('/api/login', 'POST', { username, password });

    if ("status" in resp) {
        throw resp;
    }

    authStore.set(resp);
    saveRefreshToken(resp.refreshToken);
}

export async function register(username: string, password: string) {
    const resp = await apiFetch<CredentialsLoginResponse, Credentials>('/api/register', 'PUT', { username, password });

    if ("status" in resp) {
        throw resp;
    }

    authStore.set(resp);
    saveRefreshToken(resp.refreshToken);
}

function saveRefreshToken(token: string) {
    document.cookie = `refreshToken=${token}; max-age=31536000;`;
}

function removeRefreshToken() {
    document.cookie = "refreshToken=; max-age=0;";
}

function getRefreshToken() {
    const name = "refreshToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}