import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

//route for register
router.route("/register").post(registerUser)

//route for register
// router.route("/login").post(loginUser)

export default router