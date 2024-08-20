import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
    token?: string;  // The token property is optional
}

const checkToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (typeof header !== "undefined") {

        const token = header.split(" ")[1];
        req.token = token;
        next();
    } else {
        res.status(403).json({ message: "Forbidden: No token provided" });
    }
};

export default checkToken;
