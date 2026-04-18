import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchAllVideos = createAsyncThunk(
  'video/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/videos', { params })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch videos')
    }
  }
)

export const fetchVideoById = createAsyncThunk(
  'video/fetchById',
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/videos/${videoId}`)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch video')
    }
  }
)

export const uploadVideo = createAsyncThunk(
  'video/upload',
  async ({ formData, onProgress }, { rejectWithValue }) => {
    try {
      const res = await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress) {
            onProgress(Math.round((e.loaded * 100) / e.total))
          }
        },
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed')
    }
  }
)

export const deleteVideo = createAsyncThunk(
  'video/delete',
  async (videoId, { rejectWithValue }) => {
    try {
      await api.delete(`/videos/${videoId}`)
      return videoId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete video')
    }
  }
)

export const togglePublishStatus = createAsyncThunk(
  'video/togglePublish',
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/videos/toggle/publish/${videoId}`)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle publish status')
    }
  }
)

export const updateVideoDetails = createAsyncThunk(
  'video/update',
  async ({ videoId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/videos/${videoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update video')
    }
  }
)

// ── Slice ────────────────────────────────────────────────────────────────────

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    currentVideo: null,
    pagination: null,
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
  },
  reducers: {
    clearCurrentVideo: (state) => { state.currentVideo = null },
    clearError:        (state) => { state.error = null },
    setUploadProgress: (state, { payload }) => { state.uploadProgress = payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchAllVideos.fulfilled, (state, { payload }) => {
        state.loading = false
        state.videos = payload.videos
        state.pagination = payload.pagination
      })
      .addCase(fetchAllVideos.rejected,  (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    builder
      .addCase(fetchVideoById.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchVideoById.fulfilled, (state, { payload }) => {
        state.loading = false
        state.currentVideo = payload
      })
      .addCase(fetchVideoById.rejected,  (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    builder
      .addCase(uploadVideo.pending,   (state) => { state.uploading = true; state.uploadProgress = 0 })
      .addCase(uploadVideo.fulfilled, (state, { payload }) => {
        state.uploading = false
        state.uploadProgress = 100
        state.videos.unshift(payload)
      })
      .addCase(uploadVideo.rejected,  (state, { payload }) => {
        state.uploading = false
        state.error = payload
      })

    builder
      .addCase(deleteVideo.fulfilled, (state, { payload: videoId }) => {
        state.videos = state.videos.filter((v) => v._id !== videoId)
      })

    builder
      .addCase(togglePublishStatus.fulfilled, (state, { payload }) => {
        const idx = state.videos.findIndex((v) => v._id === payload._id)
        if (idx !== -1) state.videos[idx] = payload
        if (state.currentVideo?._id === payload._id) state.currentVideo = payload
      })
  },
})

export const { clearCurrentVideo, clearError, setUploadProgress } = videoSlice.actions
export default videoSlice.reducer
