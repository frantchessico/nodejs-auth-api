import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import { JwtPayload } from "jsonwebtoken";

export const AUTH_GUARD = async(req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.headers;

    let token = access_token?.toString();
    if(!token || !token?.startsWith('Bearer')) {
        return res.status(401).json({message: 'you are not auhorized, no valid token'})
    }
    
    try {
        const payload: string | JwtPayload = verifyToken(token.split(' ')[1], 'default');
        req.user = {
            _id: payload?.userID
        }
        return next()
    } catch (error) {
        return res.status(401).json(error)
    }

}
