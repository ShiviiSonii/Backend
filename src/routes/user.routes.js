import { Router } from "express";
import { 
    loginUser, 
    registerUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
 } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import  verifyJwt from "../middlewares/auth.middleware.js";

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

// secured routes {user already needed}
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/current-user").get(verifyJwt,getCurrentUser)
router.route("/update-account-details").patch(verifyJwt,updateAccountDetails)
router.route("/avatar-update").patch(verifyJwt,upload.single("avatar"),updateUserAvatar)
router.route("/coverimage-update").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJwt,getUserChannelProfile)
router.route("/watch-history").get(verifyJwt,getUserWatchHistory)

export default router