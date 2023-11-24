
import { ErrorResponse, Request, Response } from "../../helperTypes";
import { User } from "@prisma/client";
import { generateTokens } from "../../utils/token";
import { hashPassword } from "../../utils/hashPassword";
import database from "../../utils/database";

export type RegisterRequest = {
    username: string;
    password: string;
};

export const USRNM_PSW_SPECIFIED = 'username and password must be specified';
export const USR_EXISTS = 'User already exists';
export const INT_REG_ERROR = 'Internal register error';
export type RegisterResponse = ErrorResponse<typeof USRNM_PSW_SPECIFIED | typeof USR_EXISTS | typeof INT_REG_ERROR> | {
    refreshToken: string;
    accessToken: string;
};

export async function register(req: Request<RegisterRequest>, res: Response<RegisterResponse>) {
    const { username, password } = req.body;

    if (username === undefined || password === undefined) {
        res.status(409).json({ error: USRNM_PSW_SPECIFIED });
        return;
    }

    try {
        const user = await database.user.findUnique({
            where: {
                username
            }
        });

        if (user) {
            res.status(405).json({ error: USR_EXISTS });
            return;
        }
    } catch (e) {
        console.log(e)
        res.status(400).send({ error: INT_REG_ERROR });
        return;
    }

    const hashedPassword = await hashPassword(password);

    let user: User
    try {
        user = await database.user.create({ data: { username, hashedPassword } });
    } catch (e) {
        res.status(400).send({ error: INT_REG_ERROR });
        return;
    }

    console.log(user.id)

    const tokens = generateTokens(user)

    res.status(200).json(tokens);
}