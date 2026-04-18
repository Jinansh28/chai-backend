import mongoose, {isObjectIdOrHexString, isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Video Id is invalid")
    }

    const exisitinglike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    let like;
    if(exisitinglike){
        like = await Like.findByIdAndDelete(exisitinglike._id)
        res.status(200)
        .json(new ApiResponse(200, like, "Video unliked successfully"))
    } else {
        like = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        res.status(201)
        .json(new ApiResponse(201, like, "Video liked successfully"))
    }
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400, "Comment Id is required")
    }
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Comment Id is invalid")
    }

    const exisitinglike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id}
    )

    let like;
    
    if(exisitinglike){
        like = await Like.findByIdAndDelete(exisitinglike._id)
        res.status(200)
        .json(new ApiResponse(200, like, "Comment unliked successfully"))
    } else {
        like = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        res.status(201)
        .json(new ApiResponse(201, like, "Comment liked successfully"))
    }
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400, "Tweet Id is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet Id is invalid")
    }

    const exisitinglike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    let like;

    if(exisitinglike){
        like = await Like.findByIdAndDelete(exisitinglike._id)
        res.status(200)
        .json(new ApiResponse(200, like, "Tweet unliked successfully"))
    } else {
        like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        res.status(201)
        .json(new ApiResponse(201, like, "Tweet liked successfully"))
    }
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({ 
        likedBy: req.user._id,
        video: {$exists: true},
        tweet: {$exists: false},
        comment: {$exists: false}    
    }).select({video: 1, _id: 0})
    
    res.status(200)
    .json(new ApiResponse(200, likedVideos, "Liked Videos fetched successfully"))
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}