import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if(!tweet){
        throw new ApiError(400, "Something went wrong while creating tweet")
    }

    res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"))
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    let {page = 1, limit = 10, sortBy = "createdAt", query, userId, sortType } = req.query

    page = Number(page)
    limit = Number(limit)

    const skip = (page - 1)* limit
    const filter = {}

    if(query){
        filter.content = {
            $regex: query,
            $options: "i"
        }
    }

    if(userId){
        filter.owner = userId
    }

    const sortorder = sortType === "asc" ? 1 : -1

    const tweets = await Tweet.find(
        filter,
        {content: 1}
    )
    .sort({[sortBy] : sortorder})
    .skip(skip)
    .limit(limit)

    const totalTweet = await Tweet.countDocuments(filter)

    const totalpages = Math.ceil(totalTweet/limit)

    res.status(200)
    .json(new ApiResponse(200, {
        tweets,
        pagination: {
            page,
            limit,
            totalTweet,
            totalpages
        }
    }, "All tweets fetched successfully"))
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    if(!tweetId){
        throw new ApiError(400, "Tweet Id is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id")
    }

    const existimgTweet = await Tweet.findById(tweetId)
    if(!existimgTweet){
        throw new ApiError(404, "Tweet not found")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400, "Tweet Id is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400 ,"Invalid tweet Id")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }

    res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully"))
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
