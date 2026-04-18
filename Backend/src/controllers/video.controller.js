import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {v2 as cloudinary} from "cloudinary"
import { extractPublicId } from "cloudinary-build-url"



const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy = "createdAt", sortType, userId } = req.query

    page = Number(page)
    limit = Number(limit)

    const skip = (page-1) * limit
    const filter = {}

    if(query)  {
        filter.title= {
            $regex : query,
            $options: "i"
        }
    }

    if(userId){
        filter.owner = userId
    }

    const sortorder = sortType === "asc" ? 1 : -1


    const videos = await Video.find(filter)
    .sort({ [sortBy]: sortorder})
    .skip(skip)
    .limit(limit)

    const totalvideos = await Video.countDocuments(filter)
    
    const totalpages = Math.ceil(totalvideos/limit)

    return res.status(200)
    .json(new ApiResponse(200,{
        videos,
        pagination: {
            page,
            limit,
            totalvideos,
            totalpages,
           
        }
    }, "All videos fetched successfully"))
    

    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    if(!title || !description){
        throw new ApiError(400, "All fields are required")
    }
    
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Videofile and thumbnail are required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile || !thumbnail){
        throw new ApiError(400, "Error while uploading Videofile and thumbnail on cloudinary")
    }
    
    try {
        const video = await Video.create({
            videoFile: videoFile.secure_url,
            thumbnail: thumbnail.secure_url,
            description,
            title,
            duration: videoFile.duration ?? 0,
            owner: req.user._id,
            isPublished: true
        })
    
        return res.status(201)
        .json(new ApiResponse(200, video, "Video uploaded successfully"))

    } catch (error) {
        
        if(videoFile?.public_id){
            await cloudinary.uploader.destroy(videoFile.public_id)
        }
        if(thumbnail?.public_id){
            await cloudinary.uploader.destroy(thumbnail.public_id)
        }

        throw new ApiError(400, "Error while creating video")
    }

    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc : {
                views: 1
            }
        },
        {new : true}
    )

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"))
    //TODO: get video by id
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const thumbnailLocalPath = req.file?.path
    
    const update = {}

    if(req.body?.title){
        update.title = req.body.title.trim()
    }
    if(req.body?.description){
        update.description = req.body.description.trim()
    }
    
    if(!req.body.title && !req.body.description && !thumbnailLocalPath){
        throw new ApiError(400, "Atleast one field (title, decription, thumbnail) is required")
    }

    const existingvideo = await Video.findById(videoId)
    if(!existingvideo){
        throw new ApiError(404, "Video not found")
    }

    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail){
            throw new ApiError(500, "Error while uploading file on cloudinary")
        }

        update.thumbnail = thumbnail?.secure_url

        if(existingvideo.thumbnail){
            const oldThumbnail = extractPublicId(existingvideo.thumbnail)
            if(oldThumbnail){
                await cloudinary.uploader.destroy(oldThumbnail)
                .then(result => console.log(result))
                .catch((err) => console.error("Cloudinary delete error" ,err)
                )
            }
        }
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: update
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findByIdAndDelete(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(video.thumbnail){
        const thumbnail = extractPublicId(video.thumbnail)

        if(thumbnail){
            await cloudinary.uploader.destroy(thumbnail)
            .then(result => console.log(result))
            .catch(err => console.error(err))
        }
    }

    return res.status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updatedVideo, "Video publish status toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}
