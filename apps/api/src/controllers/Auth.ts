import User from "../models/UserModel.js";
import argon2 from "argon2";
import { RequestHandler } from "express";

declare module "express-session" {
    interface SessionData {
      userId: string
    }
}

export const Login: RequestHandler = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
        return res.status(400).json({ msg: "Wrong Password" });
    }
    // req.sessionID = user.uuid;
    // console.log(`Session ID: ${req.sessionID}`);
    // console.log(`Session ID2: ${req.session.userId}`);
    req.session.userId = user.uuid;
    // req.sessionID = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    res.status(200).json({ uuid, name, email });
}

export const getUserProfile: RequestHandler = async (req, res) => {

    if (!req.session.userId) {
    // if (!req.sessionID) {
        return res.status(401).json({ msg: "Please login to your account" });
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email'],
        where: {
            uuid: req.session.userId
            // uuid: req.sessionID
        }
    })
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    res.status(200).json(user);
}

export const Logout: RequestHandler = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ msg: "Unable to logout" })
        }
        res.status(200).json({ msg: "Logout successful" })
    })
}