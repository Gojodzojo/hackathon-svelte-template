import express from "express";
import { register } from "./register";
import { login } from "./login";
import { token } from "./token";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/token", token)

export default router;