import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedRequest: boolean;
  feedError: string | null;
  currentOrder: TOrder | null;
  orderRequest: boolean;
  orderError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedRequest: false,
  feedError: null,
  currentOrder: null,
  orderRequest: false,
  orderError: null
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response?.success && response.orders?.length > 0) {
      return response.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

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
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || null;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderError = null;
        state.currentOrder = action.payload;
      });
  }
});

export const { feedSelector } = feedSlice.selectors;
