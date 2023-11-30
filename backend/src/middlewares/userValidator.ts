import { NextFunction } from "express";
import database from "../utils/database";
import { validateAccessToken } from "../utils/token";
import { ProtectedRequest, Response } from "../helperTypes";
import { User } from "@prisma/client";
import { USR_NOT_EXISTS } from "../endpoints/auth/authTypes";
import { BAD_ACCESS_TOKEN, INT_USR_VALIDATION_ERROR, ProtectedRouteErrorResponse } from "./middlewareTypes";


export async function userValidator(req: ProtectedRequest, res: Response<ProtectedRouteErrorResponse>, next: NextFunction) {
    const { authorization } = req.headers

    if (authorization === undefined || !authorization.startsWith("Bearer")) {
        res.status(401).json({ error: BAD_ACCESS_TOKEN });
        return;
    }

    const accessToken = authorization.slice("Bearer ".length)
    const payload = validateAccessToken(accessToken)

    if (!(typeof payload === "object" && "id" in payload && typeof payload.id === "number")) {
        res.status(401).json({ error: BAD_ACCESS_TOKEN });
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
        res.status(400).json({ error: INT_USR_VALIDATION_ERROR });
        return;
    }

    req.user = user;

    return next();
}