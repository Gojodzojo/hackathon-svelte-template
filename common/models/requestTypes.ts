export type ProtectedRequest<Req> = Req & {
    accessToken: string;
};

export type Credentials = {
    username: string;
    password: string;
};

export type AccessTokenRequest = {
    refreshToken: string;
};