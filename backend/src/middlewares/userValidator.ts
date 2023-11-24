import { NextFunction, Request, Response } from "express";
import database from "../utils/database";

export const userValidator = async (req: Request, res: Response, next: NextFunction) => {
    let authorizationHeader = req.headers.authorization ?? req.body.accessToken;

    if (authorizationHeader == undefined || !authorizationHeader?.startsWith("Bearer")) {
        return next();
    }

    const userToken = authorizationHeader.slice("Bearer ".length)
    const userTokenPayload = token.validate(userToken);

    if (userTokenPayload == undefined) {
        return next();
    }

    const user = await database.user.findUnique({
        where: {
            id: userTokenPayload.id,
        }
    });

    req.user = user ?? undefined;

    return next();
}

export default userValidator;