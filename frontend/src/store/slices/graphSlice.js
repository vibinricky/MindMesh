import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as graphService from '../../services/graphService';

export const fetchMyGraphs = createAsyncThunk('graphs/fetchMy', async ({ page = 0, size = 10 }, { rejectWithValue }) => {
  try {
    const data = await graphService.getMyGraphs(page, size);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch graphs');
  }
});

export const createGraph = createAsyncThunk('graphs/create', async (graphData, { rejectWithValue }) => {
  try {
    const data = await graphService.createGraph(graphData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create graph');
  }
});

export const updateGraph = createAsyncThunk('graphs/update', async ({ id, graphData }, { rejectWithValue }) => {
  try {
    const data = await graphService.updateGraph(id, graphData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update graph');
  }
});

export const deleteGraph = createAsyncThunk('graphs/delete', async (id, { rejectWithValue }) => {
  try {
    await graphService.deleteGraph(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete graph');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
};

const graphSlice = createSlice({
  name: 'graphs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGraphs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGraphs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchMyGraphs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGraph.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateGraph.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteGraph.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export default graphSlice.reducer;
