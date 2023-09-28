import type { UserData } from "./user";

export type StatusResponse = {
    status: string;
};

// Response for login or register
export type CredentialsLoginResponse = {
    userData: UserData;
    refreshToken: string;
    accessToken: string;
} | StatusResponse;

export type TokenLoginResponse = {
    userData: UserData;
    accessToken: string;
} | StatusResponse;