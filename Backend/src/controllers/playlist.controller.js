import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(400, "Both fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    res.status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "User Id is required")
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "User Id is invalid")
    }

    const userPlaylists = await Playlist.find(
        {owner: userId}
    )

    res.status(200)
    .json(new ApiResponse(200, userPlaylists,"User Playlists fetched successfully"))
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400, "Playlist Id is required")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist Id is invalid")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400, "Both Ids are required")
    }
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video or Playlist Id")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId}
        },
        {new: true}
    )

    res.status(200)
    .json(new ApiResponse(200, playlist, "Video added to Playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400, "Both Ids are required")
    }
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video or Playlist Id")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId}
        },
        {new: true}
    )

    res.status(200)
    .json(new ApiResponse(200, playlist, "Video deleted from Playlist"))
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400, "Playlist Id is required")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist Id is invalid")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"))
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    const update = {}
    if(!playlistId){
        throw new ApiError(400, "Playlist Id is required")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist Id is invalid")
    }

    if(name){
        update.name = name
    }
    if(description){
        update.description = description
    }
    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required");
    }


    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: update
        },
        {new: true}
    )

    res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))

    //TODO: update playlist
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
