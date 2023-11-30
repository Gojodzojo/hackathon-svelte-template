import { Request, Response } from "src/helperTypes";

export type TokenLoginResponse = {
    accessToken: string;
};

export async function register(req: Request, res: Response) {
    res.json
}