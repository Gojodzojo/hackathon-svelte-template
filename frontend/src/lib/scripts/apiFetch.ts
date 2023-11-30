import { get } from 'svelte/store';
import { authStore } from './auth';
import { API_PORT } from 'backend/src/constants';
import type { ErrorResponse } from 'backend/src/helperTypes';
import type { TokenLoginErrorResponse, TokenLoginRequest, TokenLoginResponse } from 'backend/src/endpoints/auth/authTypes';
import { BAD_ACCESS_TOKEN, type ProtectedRouteErrorResponse } from 'backend/src/middlewares/middlewareTypes';

const API_BASE = import.meta.env.DEV ? `http://localhost:${API_PORT}` : '';

export const NO_CONNECTION_TO_SERVER = 'No connection to server';
export const LOGGED_OUT = "Logged out"

export async function apiFetch
	<Resp extends object, Req extends object = object>
	(url: string, method: string, body?: Req, headers: HeadersInit = {}): Promise<Resp | ErrorResponse<typeof NO_CONNECTION_TO_SERVER>> {
	try {
		const resp = await fetch(API_BASE + url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			referrerPolicy: 'same-origin',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json', ...headers }
		});
		return await resp.json();
	} catch (e) {
		return { error: NO_CONNECTION_TO_SERVER };
	}
}

export async function protectedApiFetch
	<Resp extends object, Req extends object = object>
	(url: string, method: string, body?: Req, headers: HeadersInit = {}):
	Promise<Resp | ProtectedRouteErrorResponse | TokenLoginErrorResponse | ErrorResponse<typeof NO_CONNECTION_TO_SERVER | typeof LOGGED_OUT>> {
	const auth = get(authStore);

	if (typeof auth === 'string') return { error: LOGGED_OUT };
	const { accessToken, refreshToken } = auth;

	headers = { ...headers, authorization: `Bearer ${accessToken}` }

	const resp = await apiFetch<Resp | ProtectedRouteErrorResponse>(url, method, body, headers);

	if (!('error' in resp) || resp.error !== BAD_ACCESS_TOKEN) {
		return resp;
	};

	const refResp = await apiFetch<TokenLoginResponse, TokenLoginRequest>('/auth/token', 'POST', { refreshToken });

	if ('error' in refResp) {
		authStore.set("LOGGED_OUT");
		return refResp;
	}

	authStore.set({ ...refResp, refreshToken });

	return await apiFetch(url, method, body, headers);
}