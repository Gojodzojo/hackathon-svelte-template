import { get } from 'svelte/store';
import { authStore } from './authentication';
import type { TokenLoginResponse, StatusResponse } from 'common/models/responseTypes';
import type { AccessTokenRequest } from 'common/models/requestTypes';
import { API_PORT } from 'common/constants';


const API_BASE = import.meta.env.DEV ? `http://localhost:${API_PORT}` : '';

export async function apiFetch<Resp extends object, Req extends object = object>(url: string, method: string, body?: Req): Promise<Resp | StatusResponse> {
	try {
		const resp = await fetch(API_BASE + url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			referrerPolicy: 'same-origin',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' }
		});
		return await resp.json();
	} catch (e) {
		return { status: 'No connection to server' };
	}
}

export async function protectedApiFetch<Resp extends object, Req extends object = object>(url: string, method: string, body?: Req): Promise<Resp | StatusResponse> {
	const auth = get(authStore);

	if (typeof auth === 'string') return { status: 'Unauthorised user' };
	const { accessToken, refreshToken } = auth;

	const b = body ? body : {};
	const resp: Resp | StatusResponse = await apiFetch(url, method, { accessToken, ...b });

	if (!('status' in resp) || resp.status !== 'Bad access token') return resp;

	const refResp = await apiFetch<TokenLoginResponse, AccessTokenRequest>('/api/token', 'POST', { refreshToken });

	if ('status' in refResp) {
		authStore.set("LOGGED_OUT");
		return refResp;
	}

	authStore.set({ ...refResp, refreshToken });

	return await apiFetch(url, method, { accessToken, ...b });
}