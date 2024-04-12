import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {

    //TODO: create playlist
    const { name, description } = req.body;
    const owner = req.user.id; // Assuming you have user authentication middleware

    try {
        const playlist = await Playlist.create({ name, description, owner });
        return res.status(201).json(new apiResponse(201, playlist, "Playlist created successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while creating playlist"));
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const { userId } = req.params;

    try {
        const playlists = await Playlist.find({ owner: userId });
        return res.status(200).json(new apiResponse(200, playlists, "User playlists retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while getting user playlists"));
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const { playlistId } = req.params;

    // Check if playlistId is a valid ObjectId
    if (!mongoose.isValidObjectId(playlistId)) {
        return res.status(400).json(new apiError(400, "Invalid playlistId"));
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json(new apiError(404, "Playlist not found"));
        }
        return res.status(200).json(new apiResponse(200, playlist, "Playlist retrieved successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while getting playlist"));
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Check if playlistId and videoId are valid ObjectIds
    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid playlistId or videoId"));
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json(new apiError(404, "Playlist not found"));
        }
        playlist.videos.push(videoId);
        await playlist.save();
        return res.status(200).json(new apiResponse(200, playlist, "Video added to playlist successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while adding video to playlist"));
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    // Check if playlistId and videoId are valid ObjectIds
    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid playlistId or videoId"));
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json(new apiError(404, "Playlist not found"));
        }
        playlist.videos = playlist.videos.filter(id => id.toString() !== videoId.toString());
        await playlist.save();
        return res.status(200).json(new apiResponse(200, playlist, "Video removed from playlist successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while removing video from playlist"));
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    // Check if playlistId is a valid ObjectId
    if (!mongoose.isValidObjectId(playlistId)) {
        return res.status(400).json(new apiError(400, "Invalid playlistId"));
    }

    try {
        const playlist = await Playlist.findByIdAndDelete(playlistId);
        if (!playlist) {
            return res.status(404).json(new apiError(404, "Playlist not found"));
        }
        return res.status(200).json(new apiResponse(200, playlist, "Playlist deleted successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while deleting playlist"));
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!mongoose.isValidObjectId(playlistId)) {
        return res.status(400).json(new apiError(400, "Invalid playlistId"));
    }

    try {
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { name, description },
            { new: true }
        );
        if (!playlist) {
            return res.status(404).json(new apiError(404, "Playlist not found"));
        }
        return res.status(200).json(new apiResponse(200, playlist, "Playlist updated successfully"));
    } catch (error) {
        return res.status(500).json(new apiError(500, "Internal Server Error while updating playlist"));
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}