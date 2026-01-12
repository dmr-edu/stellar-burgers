import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, getFeeds, getOrderByNumber } from '../feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

const mockOrder1: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Заказ 1',
  createdAt: '2023-04-12T10:00:00.000Z',
  updatedAt: '2023-04-12T10:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2']
};

const mockOrder2: TOrder = {
  _id: '2',
  status: 'pending',
  name: 'Заказ 2',
  createdAt: '2023-04-12T11:00:00.000Z',
  updatedAt: '2023-04-12T11:00:00.000Z',
  number: 12346,
  ingredients: ['3', '4']
};

const mockFeedsData: TOrdersData = {
  orders: [mockOrder1, mockOrder2],
  total: 100,
  totalToday: 10
};

describe('feedSlice async actions', () => {
  describe('getFeeds', () => {
    it('должен устанавливать feedRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      const initialState = store.getState().feed;
      expect(initialState.feedRequest).toBe(false);

      store.dispatch({ type: getFeeds.pending.type });

      const state = store.getState().feed;
      expect(state.feedRequest).toBe(true);
      expect(state.feedError).toBe(null);
    });

    it('должен сохранять данные и устанавливать feedRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      store.dispatch({
        type: getFeeds.fulfilled.type,
        payload: mockFeedsData
      });

      const state = store.getState().feed;
      expect(state.feedRequest).toBe(false);
      expect(state.feedError).toBe(null);
      expect(state.orders).toHaveLength(2);
      expect(state.orders[0]._id).toBe('1');
      expect(state.orders[1]._id).toBe('2');
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });

    it('должен сохранять ошибку и устанавливать feedRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      const errorMessage = 'Ошибка загрузки ленты заказов';
      store.dispatch({
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().feed;
      expect(state.feedRequest).toBe(false);
      expect(state.feedError).toBe(errorMessage);
    });
  });

  describe('getOrderByNumber', () => {
    it('должен устанавливать orderRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      const initialState = store.getState().feed;
      expect(initialState.orderRequest).toBe(false);

      store.dispatch({ type: getOrderByNumber.pending.type });

      const state = store.getState().feed;
      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBe(null);
      expect(state.currentOrder).toBe(null);
    });

    it('должен сохранять данные заказа и устанавливать orderRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      store.dispatch({
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder1
      });

      const state = store.getState().feed;
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe(null);
      expect(state.currentOrder).toEqual(mockOrder1);
      expect(state.currentOrder?._id).toBe('1');
      expect(state.currentOrder?.number).toBe(12345);
    });

    it('должен сохранять ошибку и устанавливать orderRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          feed: feedSlice.reducer
        }
      });

      const errorMessage = 'Заказ не найден';
      store.dispatch({
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().feed;
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe(errorMessage);
      expect(state.currentOrder).toBe(null);
    });
  });
});
