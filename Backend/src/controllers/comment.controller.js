import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    let {page = 1, limit = 10, sortType = "desc", sortBy = "createdAt" } = req.query

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    page = Number(page)
    limit = Number(limit)
    
    const skip = (page-1) * limit
    const sortorder = sortType === "asc" ? 1 : -1

    const videoComments = await Comment.find({video: videoId})
    .sort({[sortBy]: sortorder})
    .skip(skip)
    .limit(limit)

    const totalComments = await Comment.countDocuments({video: videoId})
    const totalpages = Math.ceil(totalComments/limit)

    res.status(200)
    .json(new ApiResponse(200,{
        videoComments,
        pagination: {
            page,
            limit,
            totalComments,
            totalpages
        }
    }, "All comments on the video fetched successfully"))

    //TODO: get all comments for a video
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    res.status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"))
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body

    if(!commentId){
        throw new ApiError(400, "Comment Id is required")
    }
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {new: true}
    )

    res.status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"))
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400, "Comment Id is required")
    }
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    res.status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"))
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
