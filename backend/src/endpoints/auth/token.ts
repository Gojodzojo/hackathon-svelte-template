import database from "../../utils/database";
import { Request, Response } from "../../helperTypes";
import { generateAccessToken, validateRefreshToken } from "../../utils/token";
import { User } from "@prisma/client";
import { BAD_REFRESH_TOKEN, INT_TOKEN_ERROR, TokenLoginRequest, TokenLoginResponse, USR_NOT_EXISTS } from "./authTypes";


export async function token(req: Request<TokenLoginRequest>, res: Response<TokenLoginResponse>) {
    const { refreshToken } = req.body;

    const payload = validateRefreshToken(refreshToken)

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
        res.status(400).json({ error: INT_TOKEN_ERROR });
        return;
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({ accessToken });
}