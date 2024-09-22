import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Jokes, ApiResponse } from '@/types/apiResponse';

interface JokesState {
  jokes: Jokes[];
  loading: boolean;
  error: string | null;
}

const initialState: JokesState = {
  jokes: [],
  loading: false,
  error: null,
};

export const fetchJokes = createAsyncThunk(
  'jokes/fetchJokes',
  async (query: string) => {
    const response = await fetch(
      `https://api.chucknorris.io/jokes/search?query=${query}`
    );
    const data: ApiResponse = await response.json();
    return data.result;
  }
);

// Создаем слайс
const jokesSlice = createSlice({
  name: 'jokes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJokes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJokes.fulfilled,
        (state, action: PayloadAction<Jokes[]>) => {
          state.jokes = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchJokes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке данных';
      });
  },
});

export default jokesSlice.reducer;
