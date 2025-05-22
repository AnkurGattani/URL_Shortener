import { findUserById } from "../dao/user.dao";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req, res, next) => {
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized request"
        })
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = findUserById(decodedToken?._id).select("-password -refreshToken");
    if(!user) {
        return res.status(401).json({
            message: "Invalid access request."
        })
    }

    req.user = user;
    next();
} catch (error) {
    return res.status(500).json({
        message: "Authentication middleware error",
        error: error.message
    })
}
}