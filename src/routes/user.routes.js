import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

//route for register
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount :1
        }, 
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

//route for login
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJwt,logoutUser)

export default router