import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from '../../types/types';
import api from '../../lib/axiosConfig';
import type { FavoritesResponse } from '../../types/apiResponseTypes';

interface FavoritesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchFavoriteMovies = createAsyncThunk<
  Movie[],
  { getToken: () => Promise<string | null> }
>('favorites/fetchFavoriteMovies', async ({ getToken }, thunkAPI) => {
  try {
    const token = await getToken();
    const { data } = await api.get<FavoritesResponse>('/api/user/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      return data.movies;
    } else {
      return thunkAPI.rejectWithValue(data.message);
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchFavoriteMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default favoritesSlice.reducer;
