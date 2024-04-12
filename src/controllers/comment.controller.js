import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content, video, owner } = req.body;
    try {
        const comment = await Comment.create({
            content,
            video,
            owner
        })
    
        if(!comment) throw new apiError(400,"Something went wrong while creating comment!")
    
        return res.status(200).json(
            new apiResponse(
                200,
                comment,
                "Comment added successfully!"
            )
        )
    } catch (error) {
        return res.status(500).json(
            new apiError(500, "Internal Server Error")
        );
    }
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { content, owner } = req.body;

    if(!owner) throw new apiError(400,"Owner field is required!")

    const comment = await Comment.findByIdAndUpdate(
        req.comment?._id,
        {
            $set : {
                content:content
            }
        },
        { new : true}
    )

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            comment,
            "Comment updated successfully!"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {  owner } = req.body;

    if(!owner) throw new apiError(400,"Owner field is required!")

    const comment = await Comment.findByIdAndDelete(req.comment._id)

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            comment,
            "Comment deleted successfully!"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}