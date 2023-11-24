import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";

export function generateTokens({ id }: Pick<User, "id">) {
    const accessToken = sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
    return { accessToken, refreshToken }
}

export function generateAccessToken({ id }: Pick<User, "id">) {
    const accessToken = sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return accessToken
}

function validateToken(token: string, secret: string) {
    try {
        return verify(token, secret);
    } catch (e) {
        return undefined;
    }
}

export function validateRefreshToken(token: string) {
    return validateToken(token, process.env.REFRESH_TOKEN_SECRET)
}

export function validateAccessToken(token: string) {
    return validateToken(token, process.env.ACCESS_TOKEN_SECRET)
}