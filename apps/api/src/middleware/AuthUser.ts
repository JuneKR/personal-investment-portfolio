import User from "../models/UserModel.js";
import { RequestHandler } from "express";

export const verifyUser: RequestHandler = async (req, res, next) => {
    if(!req.session.userId) {
    // if(!req.sessionID) {    
        return res.status(401).json({msg: "Please login to your account!"})
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
            // uuid: req.sessionID
        }
    });
    if(!user) {
        return res.status(404).json({msg: "User not found"})
    }
    req.userId = user.id;
    next();
}