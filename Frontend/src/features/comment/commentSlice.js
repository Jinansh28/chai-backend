import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchComments = createAsyncThunk(
  'comment/fetch',
  async ({ videoId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/comments/${videoId}`, { params: { page, limit } })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch comments')
    }
  }
)

export const addComment = createAsyncThunk(
  'comment/add',
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/comments/${videoId}`, { content })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add comment')
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comment/delete',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/c/${commentId}`)
      return commentId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete comment')
    }
  }
)

export const updateComment = createAsyncThunk(
  'comment/update',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/comments/c/${commentId}`, { content })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update comment')
    }
  }
)

// ── Slice ────────────────────────────────────────────────────────────────────

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => { state.comments = [] },
    clearError:    (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchComments.fulfilled, (state, { payload }) => {
        state.loading = false
        // backend may return array directly or { comments: [] }
        state.comments = Array.isArray(payload) ? payload : payload.comments ?? []
      })
      .addCase(fetchComments.rejected,  (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    builder
      .addCase(addComment.fulfilled, (state, { payload }) => {
        state.comments.unshift(payload) // newest first
      })

    builder
      .addCase(deleteComment.fulfilled, (state, { payload: commentId }) => {
        state.comments = state.comments.filter((c) => c._id !== commentId)
      })

    builder
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        const idx = state.comments.findIndex((c) => c._id === payload._id)
        if (idx !== -1) state.comments[idx] = payload
      })
  },
})

export const { clearComments, clearError } = commentSlice.actions
export default commentSlice.reducer
