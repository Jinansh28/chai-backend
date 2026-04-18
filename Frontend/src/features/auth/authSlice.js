import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/current-user')
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', credentials)
      return res.data.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/register', formData)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/users/logout')
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed')
    }
  }
)

export const updateAvatar = createAsyncThunk(
  'auth/updateAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch('/users/avatar', formData)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update avatar')
    }
  }
)

export const updateCoverImage = createAsyncThunk(
  'auth/updateCoverImage',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch('/users/cover-image', formData)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update cover image')
    }
  }
)

export const updateAccountDetails = createAsyncThunk(
  'auth/updateAccount',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.patch('/users/update-account', data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update account')
    }
  }
)

// ── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    initialized: false, // true after first session check
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending,   (state) => { state.loading = true })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload
        state.isAuthenticated = true
        state.initialized = true
      })
      .addCase(fetchCurrentUser.rejected,  (state) => {
        state.loading = false
        state.initialized = true
        state.isAuthenticated = false
        state.user = null
      })

    // loginUser
    builder
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected,  (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    // registerUser
    builder
      .addCase(registerUser.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false })
      .addCase(registerUser.rejected,  (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

    // updateAvatar / updateCoverImage / updateAccount → update user in state
    builder
      .addCase(updateAvatar.fulfilled,         (state, { payload }) => { state.user = payload })
      .addCase(updateCoverImage.fulfilled,     (state, { payload }) => { state.user = payload })
      .addCase(updateAccountDetails.fulfilled, (state, { payload }) => { state.user = payload })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
