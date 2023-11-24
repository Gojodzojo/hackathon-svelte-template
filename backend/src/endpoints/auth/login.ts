import { ErrorResponse, Request, Response } from "../../helperTypes";
import { User } from "@prisma/client";
import { comparePasswords } from "../../utils/hashPassword";
import { generateTokens } from "../../utils/token";
import database from "../../utils/database";

export type LoginRequest = {
    username: string;
    password: string;
};

export const WRONG_USERNAME = 'Wrong username';
export const WRONG_PASSWORD = 'Wrong password';
export const INT_LOGIN_ERROR = 'Internal login error';
export type LoginResponse = ErrorResponse<typeof WRONG_USERNAME | typeof WRONG_PASSWORD | typeof INT_LOGIN_ERROR> | {
    refreshToken: string;
    accessToken: string;
};

export async function login(req: Request<LoginRequest>, res: Response<LoginResponse>) {
    const { username, password } = req.body;

    let user: User | null
    try {
        user = await database.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            res.status(402).json({ error: WRONG_USERNAME });
            return;
        }
    } catch (error) {
        res.status(400).send({ error: INT_LOGIN_ERROR });
        return;
    }

    const isPasswordCorrect = await comparePasswords(password, user.hashedPassword);
    if (!isPasswordCorrect) {
        res.status(401).json({ error: WRONG_PASSWORD });
        return;
    }

    const tokens = generateTokens(user)

    res.status(200).json(tokens);
}