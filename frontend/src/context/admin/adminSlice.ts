import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthResponse } from '../../types/apiResponseTypes';
import api from '../../lib/axiosConfig';

interface AdminState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isAdmin: false,
  loading: false,
  error: null,
};

export const fetchIsAdmin = createAsyncThunk<
  boolean,
  { getToken: () => Promise<string | null> }
>('admin/fetchIsAdmin', async ({ getToken }, thunkAPI) => {
  try {
    const token = await getToken();
    const { data } = await api.get<AuthResponse>('/api/admin/is-admin', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data.isAdmin;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdmin = action.payload;
      })
      .addCase(fetchIsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
