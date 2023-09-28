import { AccessTokenRequest } from "$common/models/requestTypes";
import { TokenLoginResponse } from "$common/models/responseTypes";
import { sign, verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../index";
import { TypedRequest, TypedResponse } from "../helperTypes";
import { fakeUserDB } from "../db";

export function token(req: TypedRequest<AccessTokenRequest>, res: TypedResponse<TokenLoginResponse>) {
    const { refreshToken } = req.body;

    verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
        if (err || !payload || typeof payload === 'string') {
            res.status(401).json({ status: 'Bad refresh token' });
            return;
        }

        const { id } = payload;
        const user = fakeUserDB.find(({ userData }) => userData.id === id);

        if (!user) {
            res.status(401).json({ status: 'User does not exist' });
            return;
        }

        const accessToken = sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({ accessToken, userData: user.userData });
    });
}