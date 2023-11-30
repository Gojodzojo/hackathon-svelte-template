import express from "express";
import { userValidator } from "src/middlewares/userValidator";

const router = express.Router();

// @ts-ignore
router.use(userValidator)

// router.post("/register", register);
// router.post("/login", login);
// router.post("/token", token)

export default router;