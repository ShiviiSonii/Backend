import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import {deleteFile} from "../utils/deleteOldFile.js"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        // console.log(userId)
        const user = await User.findById(userId)
        // console.log(user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })

        return {accessToken, refreshToken}

    } 
    
    catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler (async(req,res) => {
    
    // res.status(200).json({
    //     message : "ok"
    // })

    // get user details from frontend
    const {fullname, username, email,password} = req.body
    // console.log("fullname :",fullname)

    // validation
    if(
        [fullname, username , email, password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "All fields are required!")
    }

    // check if user already exists : username , email
    const existedUser = await User.findOne({
        $or: [ { email },{ username } ]
    })

    if(existedUser){
        throw new apiError(409, "User already exists!")
    }

    // check for images and avatars
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // check avatar images (which is mandatory)
    if(!avatarLocalPath) throw new apiError(400, "Please upload avatar file!")

    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // check avatar bcoz it is mandatory field
    // check avatar images (which is mandatory)
    if(!avatar) throw new apiError(400, "Please upload avatar file!")

    // create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    // check user is present or not
    // remove password field and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser) throw new apiError(500, "Something went wrong while registering the user")

    // return user
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully!")
    )
    

})

const loginUser = asyncHandler (async(req,res) => {

    // get user details from user ( req->body - data)
    const {email, username, password} = req.body

    // get access on username or email
    if (!username && !email) throw new apiError(400, "Username or email is required")

    // find the user based on username or email
    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user) throw new apiError(404, "User doesnot exist!")

    // check the password
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid)  throw new apiError(401, "Password incorrect!")

    // generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // send tokens based on cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user : loggedInUser , accessToken , refreshToken
            }, 
            "User logged in successfully!"
        )
    )
})

const logoutUser = asyncHandler (async(req,res) => {
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(
        200,
        {

        },
        "User logged out successfully"
    ))

})

// controller for refresh acess token 
const refreshAccessToken = asyncHandler (async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new apiError(401,"Unauthorized request!")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new apiError(401,"Invalid refresh token!")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401,"Refresh token is expired or used!")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken", newrefreshToken,options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken , 
                    refreshToken : newrefreshToken
                }, 
                "Access token refreshed!"
            )
        )
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid refresh token!")
    }
})

const changeCurrentPassword = asyncHandler (async(req,res) =>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new apiError(400,"Invalid old password!")

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {}, 
            "Password changed successfully!"
    ))
})

const getCurrentUser = asyncHandler (async(req,res) => {
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            req.user,
            "Current user fetched successfully!"
        )
    )
    
    
})

const updateAccountDetails = asyncHandler (async(req,res) => {
    const {fullname, email} = req.body

    if(!fullname || !email) {
        throw new apiError(400,"All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set: {
            fullname : fullname,
            email : email
           } 
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            user,
            "Account details updated successfully!"
        )
    )

})

const updateUserAvatar = asyncHandler (async(req,res) => {

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) throw new apiError(400,"Avatar path not found")

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) throw new apiError(400,"Error while uploading on avatar!")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :
            {
                avatar : avatar.url
            }
        },
        {new: true}
    ).select(-password)

     // Delete old avatar if it exists
     if (req.user.avatar) {
        deleteFile(req.user.avatar); // Use the utility function to delete the old avatar file
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            user,
            "avatar modified successfully!"
        )
    )

})

const updateUserCoverImage = asyncHandler (async(req,res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath) throw new apiError(400,"Cover Image path not found")

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url) throw new apiError(400,"Error while uploading on coverImage!")

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :
            {
                coverImage : coverImage.url
            }
        },
        {new: true}
    ).select(-password)

    // TODO : DELETE OLD IMAGE

    if (req.user.coverImage) {
        deleteFile(req.user.coverImage); // Use the utility function to delete the old avatar file
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            user,
            "coverImage modified successfully!"
        )
    )
})

export {
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}