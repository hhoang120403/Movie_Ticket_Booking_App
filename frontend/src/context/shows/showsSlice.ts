import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ShowsResponse } from '../../types/apiResponseTypes';
import type { Movie } from '../../types/types';
import api from '../../lib/axiosConfig';

interface ShowsState {
  shows: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: ShowsState = {
  shows: [],
  loading: false,
  error: null,
};

export const fetchShows = createAsyncThunk<Movie[]>(
  'shows/fetchShows',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get<ShowsResponse>('/api/show/all');
      if (data.success) {
        return data.shows;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload;
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default showsSlice.reducer;
