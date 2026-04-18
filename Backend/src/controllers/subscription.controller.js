import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { application } from "express"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "Channel Id is required")
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel Id")
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    let subscription;

    if(!existingSubscription){
        subscription = await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })

        res.status(200)
        .json(new ApiResponse(201, subscription, "Subscription added successfully"))
    } else {
        subscription = await Subscription.findByIdAndDelete(existingSubscription._id)
        res.status(200)
        .json(new ApiResponse(200, null, "Subscription removed successfully"))
    }
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "Channel Id is required")
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid subscription Id")
    }

    const channel = await Subscription.find(
        {channel : channelId}
    ).select({subscriber: 1, _id: 0})

    const channelSubscribers = await Subscription.countDocuments(
        {channel : channelId}
    )

    res.status(200)
    .json(new ApiResponse(200, {channel, channelSubscribers}, "Total subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    if(!subscriberId){
        throw new ApiError(400, "Subscriber Id is required")
    }
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber Id")
    }

    const subscribedChannel = await Subscription.find(
        {subscriber: subscriberId}
    ).select({_id: 0,channel: 1})

    const subscribedChannelCount = await Subscription.countDocuments(
        {subscriber: subscriberId}
    )

    res.status(200)
    .json(new ApiResponse(200, {subscribedChannel, subscribedChannelCount},"Channels Subscribed fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}