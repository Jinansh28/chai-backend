import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const totalVideos = await Video.countDocuments({owner: req.user._id})

    const totalViews = await Video.aggregate([
        {$match: {owner: req.user._id}},
        {$group: {_id: null, views: {$sum: "$views"}}}
    ])

    const totalSubscribers = await Subscription.countDocuments({channel: req.user._id})

    const videoIds = (await Video.find({owner: req.user._id}).select("_id")).map(v => v._id)
    const totalLikes = await Like.countDocuments({video: {$in: videoIds}})


    res.status(200)
    .json(new ApiResponse(200, {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes
    }, "Channel status fetched successfully"))
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelVideos = await Video.find({owner: req.user._id}, {_id: 0})
    console.log(channelVideos);
    
    res.status(200)
    .json(new ApiResponse(200, channelVideos, "User videos fetched successfully"))
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }