import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  ordersRequest: boolean;
  ordersError: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  ordersRequest: false,
  ordersError: null
};

export const getOrders = createAsyncThunk('orders/getOrders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.ordersRequest = true;
        state.ordersError = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.ordersRequest = false;
        state.ordersError = action.error.message || null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersRequest = false;
        state.ordersError = null;
      });
  }
});

export const { ordersSelector } = ordersSlice.selectors;
