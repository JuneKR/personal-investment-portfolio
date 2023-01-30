import express from "express";
import {Login, Logout, getUserProfile} from "../controllers/Auth.js";

const router = express.Router();

router.get('/profile', getUserProfile);
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;