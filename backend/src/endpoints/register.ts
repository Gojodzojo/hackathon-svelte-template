import { Credentials } from "$common/models/requestTypes";
import { CredentialsLoginResponse } from "$common/models/responseTypes";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../index";
import { fakeUserDB } from "../db";
import { TypedRequest, TypedResponse } from "../helperTypes";
import { UserData } from "$common/models/user";

const SALT_ROUNDS = 10;

export async function register(req: TypedRequest<Credentials>, res: TypedResponse<CredentialsLoginResponse>) {
    const { username, password } = req.body;

    if (username === undefined || password === undefined) {
        res.status(409).json({ status: 'username and password must be specified' });
        return;
    }

    if (fakeUserDB.some(({ userData }) => userData.username === username)) {
        res.status(405).json({ status: 'User already exists' });
        return;
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);

    let id = 0;
    while (true) {
        id = Math.round(Math.random() * 10000) % 10000;
        if (!fakeUserDB.some(({ userData }) => userData.id === id)) break;
    }

    const userData: UserData = {
        id,
        username
    };

    fakeUserDB.push({ hashedPassword, userData });

    const accessToken = sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

    res.json({ accessToken, refreshToken, userData });
}