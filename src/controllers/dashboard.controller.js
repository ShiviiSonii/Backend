import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
       try {
         const channelId = req.params.channelId;
 
         if(!channelId) throw new apiError(400,"Channel not found")

         // Fetch video stats
         const videos = await Video.find({ channel: channelId });
         const totalVideoViews = videos.reduce((acc, video) => acc + video.views, 0);
         const totalLikes = await Like.countDocuments({ video: { $in: videos.map(video => video._id) } });

         // Fetch total subscribers 
         const totalSubscribers = await Subscription.countDocuments({ channelId });
 
         // Respond with channel stats
         return res
         .status(200)
         .json(
             new apiResponse(200, 
             {
                 totalVideoViews,
                 totalSubscribers,
                 totalVideos: videos.length,
                 totalLikes
             },
              "Channel stats retrieved successfully")
         );
       } catch (error) {
            return res
            .status(500)
            .json(
                new apiError(
                    500, 
                    "Internal Server Error while retrieving channel stats")
            );
       }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

        try {
            const channelId = req.params.channelId;
            if(!channelId) throw new apiError(400,"Channel not found")
    
            // Fetch videos uploaded by the channel
            const videos = await Video.find({ channel: channelId });
    
            // Respond with the videos
            return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    videos,
                    "Channel videos retrieved successfully"
                )
            );
        } catch (error) {
            return res
            .status(500)
            .json(
                new apiError(
                    500, 
                    "Internal Server Error while retrieving channel videos")
            );
        }
})

export {
    getChannelStats, 
    getChannelVideos
    }