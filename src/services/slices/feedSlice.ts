import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedRequest: boolean;
  feedError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedRequest: false,
  feedError: null
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    feedSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.feedRequest = true;
        state.feedError = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.feedRequest = false;
        state.feedError = action.error.message || null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.feedRequest = false;
        state.feedError = null;
      });
  }
});

export const { feedSelector } = feedSlice.selectors;
