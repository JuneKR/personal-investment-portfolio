import argon2 from "argon2";
import User from "../models/UserModel.js";
import { RequestHandler } from "express";

export const getUsers: RequestHandler = async(req, res) => {
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email']
        });
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById: RequestHandler = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email'],
            where: {
                uuid: req.params.id,
            }
        });
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser: RequestHandler = async(req, res) => {
    const {name, email, password, confPassword} = req.body;
    if (password !== confPassword) {
        return res.status(400).json({msg: "Password and Confirm Password do not match"})
    }
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
        })
        res.status(201).json({msg: "Successful Register"});
    } catch (error: any) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser: RequestHandler = async(req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });

    /* Check User */
    if(!user) {
        return res.status(404).json({msg: "User not found"});
    }

    /* Check Password */
    const {name, email, password, confPassword} = req.body;
    let hashPassword;
    if(password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword) {
        return res.status(400).json({msg: "Password and Confirm Password do not match"})
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword
        }, {
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated Successfully"})
    } catch (error: any) {
        return res.status(400).json({msg: error.message});
    }
}

export const deleteUser: RequestHandler = async(req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });

    /* Check User */
    if(!user) {
        return res.status(404).json({msg: "User not found"});
    }

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({msg: "User Deleted Successfully"})
    } catch (error: any) {
        return res.status(400).json({msg: error.message});
    }
}