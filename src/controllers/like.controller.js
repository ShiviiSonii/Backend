import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    // Check if videoId is a valid ObjectId
    if (!isValidObjectId(videoId)) {
        return res
        .status(400)
        .json(
            new apiError(
                400,
                 "Invalid videoId"
        )
    );
    }

    try {
        // Check if the user has already liked the video
        const existingLike = await Like.findOne({ user: userId, video: videoId });

        if (existingLike) {
            // If the user has already liked the video, remove the like
            await Like.findByIdAndDelete(existingLike._id);

            return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    null,
                    "Like removed successfully"
            ));
        } else {
            // If the user has not liked the video, add the like
            const like = await Like.create({ user: userId, video: videoId });
            return res
            .status(201)
            .json(
                new apiResponse(
                201, 
                like,
                "Like added successfully"
            ));
        }
    } catch (error) {
        return res
        .status(500)
        .json(new apiError(
            500, 
            "Internal Server Error while toggling video like"
        ));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user.id; // Assuming you have user authentication middleware

    // Check if commentId is a valid ObjectId
    if (!isValidObjectId(commentId)) {
        return res
        .status(400)
        .json(
            new apiError(
                400,
                 "Invalid commentId"
        )
    );
    }

    try {
        // Check if the user has already liked the video
        const existingLike = await Like.findOne({ user: userId, comment: commentId });

        if (existingLike) {
            // If the user has already liked the video, remove the like
            await Like.findByIdAndDelete(existingLike._id);

            return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    null,
                    "Like removed successfully"
            ));
        } else {
            // If the user has not liked the video, add the like
            const like = await Like.create({ user: userId, comment: commentId });
            return res
            .status(201)
            .json(
                new apiResponse(
                201, 
                like,
                "Like added successfully"
            ));
        }
    } catch (error) {
        return res
        .status(500)
        .json(new apiError(
            500, 
            "Internal Server Error while toggling video like"
        ));
    }
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user.id; // Assuming you have user authentication middleware

    // Check if tweetId is a valid ObjectId
    if (!isValidObjectId(tweetId)) {
        return res
        .status(400)
        .json(
            new apiError(
                400,
                 "Invalid tweetId"
        )
    );
    }

    try {
        // Check if the user has already liked the video
        const existingLike = await Like.findOne({ user: userId, tweet: tweetId });

        if (existingLike) {
            // If the user has already liked the video, remove the like
            await Like.findByIdAndDelete(existingLike._id);

            return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    null,
                    "Like removed successfully"
            ));
        } else {
            // If the user has not liked the video, add the like
            const like = await Like.create({ user: userId, tweet: tweetId });
            return res
            .status(201)
            .json(
                new apiResponse(
                201, 
                like,
                "Like added successfully"
            ));
        }
    } catch (error) {
        return res
        .status(500)
        .json(new apiError(
            500, 
            "Internal Server Error while toggling video like"
        ));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user.id; // Assuming you have user authentication middleware

    try {
        // Find all likes by the user
        const userLikes = await Like.find({ user: userId });

        // Extract video IDs from the likes
        const videoIds = userLikes.map(like => like.video);

        // Query videos based on the extracted IDs
        const likedVideos = await Video.find({ _id: { $in: videoIds } });

        return res.status(200).json(new apiResponse(200, likedVideos, "Liked videos retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while retrieving liked videos"));
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}