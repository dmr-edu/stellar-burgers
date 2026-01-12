import { configureStore } from '@reduxjs/toolkit';
import { ordersSlice, getOrders } from '../ordersSlice';
import { TOrder } from '@utils-types';

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

const mockOrders: TOrder[] = [mockOrder1, mockOrder2];

describe('ordersSlice async actions', () => {
  describe('getOrders', () => {
    it('должен устанавливать ordersRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          orders: ordersSlice.reducer
        }
      });

      const initialState = store.getState().orders;
      expect(initialState.ordersRequest).toBe(false);

      store.dispatch({ type: getOrders.pending.type });

      const state = store.getState().orders;
      expect(state.ordersRequest).toBe(true);
      expect(state.ordersError).toBe(null);
    });

    it('должен сохранять данные и устанавливать ordersRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          orders: ordersSlice.reducer
        }
      });

      store.dispatch({
        type: getOrders.fulfilled.type,
        payload: mockOrders
      });

      const state = store.getState().orders;
      expect(state.ordersRequest).toBe(false);
      expect(state.ordersError).toBe(null);
      expect(state.orders).toHaveLength(2);
      expect(state.orders[0]._id).toBe('1');
      expect(state.orders[1]._id).toBe('2');
    });

    it('должен сохранять ошибку и устанавливать ordersRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          orders: ordersSlice.reducer
        }
      });

      const errorMessage = 'Ошибка загрузки истории заказов';
      store.dispatch({
        type: getOrders.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().orders;
      expect(state.ordersRequest).toBe(false);
      expect(state.ordersError).toBe(errorMessage);
    });
  });
});

