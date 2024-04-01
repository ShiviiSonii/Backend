import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js"

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

export {registerUser}