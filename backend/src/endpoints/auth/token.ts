import database from "../../utils/database";
import { Request, Response, ErrorResponse } from "../../helperTypes";
import { generateAccessToken, validateRefreshToken } from "../../utils/token";
import { User } from "@prisma/client";

export type TokenLoginRequest = {
    refreshToken: string;
};

export const BAD_REFRESH_TOKEN = 'Bad refresh token';
export const USR_NOT_EXISTS = 'User does not exist';
export const INT_TOKEN_ERROR = 'Internal token error';
export type TokenLoginResponse = ErrorResponse<typeof BAD_REFRESH_TOKEN | typeof USR_NOT_EXISTS> | {
    accessToken: string;
};

export async function token(req: Request<TokenLoginRequest>, res: Response<TokenLoginResponse>) {
    const { refreshToken } = req.body;

    const payload = validateRefreshToken(refreshToken)
    console.log(payload)
    if (!(typeof payload === "object" && "id" in payload && typeof payload.id === "number")) {
        res.status(401).json({ error: BAD_REFRESH_TOKEN });
        return;
    }

    const { id } = payload

    let user: User | null
    try {
        user = await database.user.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            res.status(405).json({ error: USR_NOT_EXISTS });
            return;
        }
    } catch (e) {
        res.status(400).send({ error: INT_TOKEN_ERROR });
        return;
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
}