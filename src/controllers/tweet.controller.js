import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {owner,content} = req.body


    try {

        if(!owner || !content) throw new apiError(400,"Owner  and Content field is required!")
        
        const tweet = await Tweet.create({
            owner,
            content
        })
    
        if(!tweet) throw new apiError(400,"Something went wrong while creating tweet")
    
        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                tweet,
                "Tweet created successfully!"
            )
        )
    } catch (error) {
        return res.status(500).json(
            new apiError(500, "Internal Server Error while adding tweet")
        );
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content, owner } = req.body;

    if(!owner) throw new apiError(400,"Owner field is required!")

    const tweet = await Tweet.findByIdAndUpdate(
        req.params.tweetId,
        {
            $set : {
                content:content
            }
        },
        { new : true}
    )

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            tweet,
            "Tweet updated successfully!"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {  owner } = req.body;

    if(!owner) throw new apiError(400,"Owner field is required!")

    console.log(req.params.tweetId)
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId)

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            tweet,
            "Tweet deleted successfully!"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}