import { get } from 'svelte/store';
import { authStore } from './auth';
import { API_PORT } from 'backend/src/constants';
import type { BAD_ACCESS_TOKEN, ErrorResponse } from 'backend/src/helperTypes';
import type { BAD_REFRESH_TOKEN, TokenLoginRequest, TokenLoginResponse, USR_NOT_EXISTS } from 'backend/src/endpoints/auth/token';

const API_BASE = import.meta.env.DEV ? `http://localhost:${API_PORT}` : '';

export const NO_CONNECTION_TO_SERVER = 'No connection to server';
export const UNAUTHORISED_USER = 'Unauthorised user';

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

// export async function protectedApiFetch
// 	<Resp extends object, Req extends object = object>
// 	(url: string, method: string, body?: Req):
// 	Promise<Resp | ErrorResponse<typeof NO_CONNECTION_TO_SERVER | typeof UNAUTHORISED_USER | typeof USR_NOT_EXISTS | typeof BAD_REFRESH_TOKEN>> {
// 	const auth = get(authStore);

// 	if (typeof auth === 'string') return { error: UNAUTHORISED_USER };
// 	const { accessToken, refreshToken } = auth;

// 	const b = body ? body : {};
// 	const resp = await apiFetch<Resp | ErrorResponse<typeof BAD_ACCESS_TOKEN>>(url, method, { accessToken, ...b });

// 	if (!('error' in resp) || resp.error !== BAD_ACCESS_TOKEN) {
// 		return resp;
// 	};

// 	const refResp = await apiFetch<TokenLoginResponse, TokenLoginRequest>('/api/token', 'POST', { refreshToken });

// 	if ('error' in refResp) {
// 		authStore.set("LOGGED_OUT");
// 		return refResp;
// 	}

// 	authStore.set({ ...refResp, refreshToken });

// 	return await apiFetch(url, method, { accessToken, ...b });
// }