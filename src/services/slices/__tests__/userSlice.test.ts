import { configureStore } from '@reduxjs/toolkit';
import {
  userSlice,
  loginUser,
  registerUser,
  checkUserAuth,
  updateUser,
  logoutUser
} from '../userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice async actions', () => {
  describe('loginUser', () => {
    it('должен устанавливать loginUserRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      const initialState = store.getState().user;
      expect(initialState.loginUserRequest).toBe(false);

      store.dispatch({ type: loginUser.pending.type });

      const state = store.getState().user;
      expect(state.loginUserRequest).toBe(true);
      expect(state.loginUserError).toBe(null);
    });

    it('должен сохранять данные пользователя и устанавливать loginUserRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.loginUserRequest).toBe(false);
      expect(state.loginUserError).toBe(null);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен сохранять ошибку и устанавливать loginUserRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      const errorMessage = 'Ошибка входа';
      store.dispatch({
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().user;
      expect(state.loginUserRequest).toBe(false);
      expect(state.loginUserError).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('должен устанавливать registerUserRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      const initialState = store.getState().user;
      expect(initialState.registerUserRequest).toBe(false);

      store.dispatch({ type: registerUser.pending.type });

      const state = store.getState().user;
      expect(state.registerUserRequest).toBe(true);
      expect(state.registerUserError).toBe(null);
    });

    it('должен сохранять данные пользователя и устанавливать registerUserRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      store.dispatch({
        type: registerUser.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.registerUserRequest).toBe(false);
      expect(state.registerUserError).toBe(null);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен сохранять ошибку и устанавливать registerUserRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      const errorMessage = 'Ошибка регистрации';
      store.dispatch({
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().user;
      expect(state.registerUserRequest).toBe(false);
      expect(state.registerUserError).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('checkUserAuth', () => {
    it('должен устанавливать isAuthChecked в false при pending', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      const initialState = store.getState().user;
      expect(initialState.isAuthChecked).toBe(false);

      store.dispatch({ type: checkUserAuth.pending.type });

      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(false);
    });

    it('должен сохранять данные пользователя и устанавливать isAuthChecked в true при fulfilled', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      store.dispatch({
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен устанавливать isAuthenticated в false и isAuthChecked в true при rejected', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      store.dispatch({
        type: checkUserAuth.rejected.type
      });

      const state = store.getState().user;
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.data).toBe(null);
    });
  });

  describe('updateUser', () => {
    const updatedUser: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };

    it('должен не изменять состояние при pending', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем начального пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;

      store.dispatch({ type: updateUser.pending.type });

      const state = store.getState().user;
      // Состояние не должно измениться, так как нет обработчика pending
      expect(state.data).toEqual(stateBefore.data);
    });

    it('должен обновлять данные пользователя при fulfilled', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем начального пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;
      expect(stateBefore.data).toEqual(mockUser);

      store.dispatch({
        type: updateUser.fulfilled.type,
        payload: updatedUser
      });

      const state = store.getState().user;
      expect(state.data).toEqual(updatedUser);
      expect(state.data?.email).toBe('updated@example.com');
      expect(state.data?.name).toBe('Updated User');
    });

    it('должен не изменять состояние при rejected', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем начального пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;

      const errorMessage = 'Ошибка обновления данных';
      store.dispatch({
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().user;
      // Состояние не должно измениться, так как нет обработчика rejected
      expect(state.data).toEqual(stateBefore.data);
    });
  });

  describe('logoutUser', () => {
    it('должен не изменять состояние при pending', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;

      store.dispatch({ type: logoutUser.pending.type });

      const state = store.getState().user;
      // Состояние не должно измениться, так как нет обработчика pending
      expect(state.data).toEqual(stateBefore.data);
      expect(state.isAuthenticated).toBe(stateBefore.isAuthenticated);
    });

    it('должен очищать данные пользователя и устанавливать isAuthenticated в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;
      expect(stateBefore.data).toEqual(mockUser);
      expect(stateBefore.isAuthenticated).toBe(true);

      store.dispatch({
        type: logoutUser.fulfilled.type,
        payload: true
      });

      const state = store.getState().user;
      expect(state.data).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен не изменять состояние при rejected', () => {
      const store = configureStore({
        reducer: {
          user: userSlice.reducer
        }
      });

      // Сначала устанавливаем пользователя
      store.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      const stateBefore = store.getState().user;

      const errorMessage = 'Ошибка выхода';
      store.dispatch({
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().user;
      // Состояние не должно измениться, так как нет обработчика rejected
      expect(state.data).toEqual(stateBefore.data);
      expect(state.isAuthenticated).toBe(stateBefore.isAuthenticated);
    });
  });
});
