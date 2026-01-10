import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice, getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булочка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 10,
    calories: 200,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  },
  {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 3,
    carbohydrates: 15,
    calories: 50,
    price: 50,
    image: 'sauce.png',
    image_large: 'sauce-large.png',
    image_mobile: 'sauce-mobile.png'
  }
];

describe('ingredientsSlice async actions', () => {
  describe('getIngredients', () => {
    it('должен устанавливать ingredientsRequest в true при pending', () => {
      const store = configureStore({
        reducer: {
          ingredients: ingredientsSlice.reducer
        }
      });

      const initialState = store.getState().ingredients;
      expect(initialState.ingredientsRequest).toBe(false);

      store.dispatch({ type: getIngredients.pending.type });

      const state = store.getState().ingredients;
      expect(state.ingredientsRequest).toBe(true);
      expect(state.ingredientsError).toBe(null);
    });

    it('должен сохранять данные и устанавливать ingredientsRequest в false при fulfilled', () => {
      const store = configureStore({
        reducer: {
          ingredients: ingredientsSlice.reducer
        }
      });

      store.dispatch({
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      });

      const state = store.getState().ingredients;
      expect(state.ingredientsRequest).toBe(false);
      expect(state.ingredientsError).toBe(null);
      expect(state.ingredients.buns).toHaveLength(1);
      expect(state.ingredients.buns[0]._id).toBe('1');
      expect(state.ingredients.mains).toHaveLength(1);
      expect(state.ingredients.mains[0]._id).toBe('2');
      expect(state.ingredients.sauces).toHaveLength(1);
      expect(state.ingredients.sauces[0]._id).toBe('3');
    });

    it('должен сохранять ошибку и устанавливать ingredientsRequest в false при rejected', () => {
      const store = configureStore({
        reducer: {
          ingredients: ingredientsSlice.reducer
        }
      });

      const errorMessage = 'Ошибка загрузки ингредиентов';
      store.dispatch({
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      });

      const state = store.getState().ingredients;
      expect(state.ingredientsRequest).toBe(false);
      expect(state.ingredientsError).toBe(errorMessage);
    });
  });
});
