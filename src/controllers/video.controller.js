import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js"; 
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    try {
        let filter = {};

        // You can add logic to apply filtering based on query parameters
        // For example, if userId is provided, filter videos by user

        if (userId) {
            filter = { user: userId };
        }

        const videos = await Video.find(filter)
            .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalVideos = await Video.countDocuments(filter);

        return res.status(200).json(new apiResponse(200, { videos, totalVideos }, "Videos retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while getting videos"));
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    try {
        // Assuming you have middleware to handle file upload and the uploaded file is available as req.file
        const videoUrl = await uploadOnCloudinary(req.file);

        // Create the video with user ID
        const video = await Video.create({ title, description, videoUrl, user: userId });
        return res.status(201).json(new apiResponse(201, video, "Video published successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while publishing video"));
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid videoId"));
    }

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json(new apiError(404, "Video not found"));
        }
        return res.status(200).json(new apiResponse(200, video, "Video retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while getting video"));
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid videoId"));
    }

    try {
        // Check if the user owns the video
        const video = await Video.findOneAndUpdate(
            { _id: videoId, user: userId }, // Filter by both videoId and userId
            { title, description, thumbnail },
            { new: true }
        );
        if (!video) {
            return res.status(404).json(new apiError(404, "Video not found or user is not the owner"));
        }
        return res.status(200).json(new apiResponse(200, video, "Video updated successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while updating video"));
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid videoId"));
    }

    try {
        // Check if the user owns the video
        const video = await Video.findOneAndDelete({ _id: videoId, user: userId });
        if (!video) {
            return res.status(404).json(new apiError(404, "Video not found or user is not the owner"));
        }
        return res.status(200).json(new apiResponse(200, video, "Video deleted successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while deleting video"));
    }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid videoId"));
    }

    try {
        // Check if the user owns the video
        const video = await Video.findOneAndUpdate(
            { _id: videoId, user: userId },
            { $set: { published: true } }, // Assuming 'published' is a field indicating the publish status
            { new: true }
        );
        if (!video) {
            return res.status(404).json(new apiError(404, "Video not found or user is not the owner"));
        }
        return res.status(200).json(new apiResponse(200, video, "Publish status toggled successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while toggling publish status"));
    }
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
