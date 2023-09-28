import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../index";
import { TypedRequest, TypedResponse } from "../helperTypes";
import { Credentials } from '$common/models/requestTypes';
import { CredentialsLoginResponse } from '$common/models/responseTypes';
import { compare } from "bcrypt";
import { fakeUserDB } from "../db";
import { sign } from "jsonwebtoken";


export async function login(req: TypedRequest<Credentials>, res: TypedResponse<CredentialsLoginResponse>) {
    const { username, password } = req.body;

    const user = fakeUserDB.find(({ userData }) => userData.username === username);
    if (!user) {
        res.status(401).json({ status: 'Wrong username' });
        return;
    }

    const isPasswordCorrect = await compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
        res.status(401).json({ status: 'Wrong password' });
        return;
    }

    const accessToken = sign({ id: user.userData.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = sign({ id: user.userData.id }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

    res.status(200).json({ accessToken, refreshToken, userData: user.userData });
}