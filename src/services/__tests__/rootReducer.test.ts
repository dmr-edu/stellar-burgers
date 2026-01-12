import { configureStore } from '@reduxjs/toolkit';
import {
  userSlice,
  constructorSlice,
  ingredientsSlice,
  feedSlice,
  ordersSlice
} from '@slices';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined состоянием', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer,
        ingredients: ingredientsSlice.reducer,
        constructorState: constructorSlice.reducer,
        feed: feedSlice.reducer,
        orders: ordersSlice.reducer
      }
    });

    const state = store.getState();

    expect(state.user).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.constructorState).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.orders).toBeDefined();
  });

  it('должен возвращать текущее состояние при неизвестном экшене', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer,
        ingredients: ingredientsSlice.reducer,
        constructorState: constructorSlice.reducer,
        feed: feedSlice.reducer,
        orders: ordersSlice.reducer
      }
    });

    const initialState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' } as any);

    const stateAfterUnknownAction = store.getState();

    expect(stateAfterUnknownAction).toEqual(initialState);
  });
});

