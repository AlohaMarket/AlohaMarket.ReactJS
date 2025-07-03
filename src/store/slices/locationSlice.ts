import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Province } from '@/types/location.type';
import { locationApi } from '@/apis/location';

export interface LocationState {
  provinces: Province[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  lastFetched: number | null;
}

const initialState: LocationState = {
  provinces: [],
  loading: false,
  error: null,
  loaded: false,
  lastFetched: null,
};

// Async thunk để fetch location tree
export const fetchLocationTree = createAsyncThunk(
  'location/fetchLocationTree',
  async (_, { rejectWithValue }) => {
    try {
      const provinces = await locationApi.getLocationTree();
      return provinces;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch location tree';
      return rejectWithValue(errorMessage);
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
    resetLocationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationTree.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
        state.loaded = true;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchLocationTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loaded = false;
      });
  },
});

export const { clearLocationError, resetLocationState } = locationSlice.actions;
export default locationSlice.reducer;