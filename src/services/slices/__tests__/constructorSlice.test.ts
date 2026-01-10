import { configureStore } from '@reduxjs/toolkit';
import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockIngredient1: TIngredient = {
  _id: '1',
  name: 'Ингредиент 1',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 100,
  image: 'image1.png',
  image_large: 'image1-large.png',
  image_mobile: 'image1-mobile.png'
};

const mockIngredient2: TIngredient = {
  _id: '2',
  name: 'Ингредиент 2',
  type: 'sauce',
  proteins: 5,
  fat: 3,
  carbohydrates: 10,
  calories: 50,
  price: 50,
  image: 'image2.png',
  image_large: 'image2-large.png',
  image_mobile: 'image2-mobile.png'
};

const mockIngredient3: TIngredient = {
  _id: '3',
  name: 'Ингредиент 3',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 25,
  calories: 150,
  price: 150,
  image: 'image3.png',
  image_large: 'image3-large.png',
  image_mobile: 'image3-mobile.png'
};

describe('constructorSlice reducers', () => {
  describe('addIngredient', () => {
    it('должен добавлять ингредиент в конструктор', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      const initialState = store.getState().constructorState;
      expect(initialState.constructorItems.ingredients).toHaveLength(0);

      store.dispatch(addIngredient(mockIngredient1));

      const state = store.getState().constructorState;
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]._id).toBe(
        mockIngredient1._id
      );
      expect(state.constructorItems.ingredients[0].name).toBe(
        mockIngredient1.name
      );
      expect(state.constructorItems.ingredients[0].id).toBeDefined();
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент из конструктора', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      store.dispatch(addIngredient(mockIngredient1));
      store.dispatch(addIngredient(mockIngredient2));

      const stateBefore = store.getState().constructorState;
      expect(stateBefore.constructorItems.ingredients).toHaveLength(2);

      const ingredientIdToRemove =
        stateBefore.constructorItems.ingredients[0].id;
      store.dispatch(removeIngredient(ingredientIdToRemove));

      const stateAfter = store.getState().constructorState;
      expect(stateAfter.constructorItems.ingredients).toHaveLength(1);
      expect(stateAfter.constructorItems.ingredients[0]._id).toBe(
        mockIngredient2._id
      );
    });
  });

  describe('moveUp', () => {
    it('должен перемещать ингредиент вверх в списке', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      store.dispatch(addIngredient(mockIngredient1));
      store.dispatch(addIngredient(mockIngredient2));
      store.dispatch(addIngredient(mockIngredient3));

      const stateBefore = store.getState().constructorState;
      const secondIngredient = stateBefore.constructorItems.ingredients[1];
      expect(stateBefore.constructorItems.ingredients[1]._id).toBe(
        mockIngredient2._id
      );

      store.dispatch(moveUp(secondIngredient));

      const stateAfter = store.getState().constructorState;
      expect(stateAfter.constructorItems.ingredients[0]._id).toBe(
        mockIngredient2._id
      );
      expect(stateAfter.constructorItems.ingredients[1]._id).toBe(
        mockIngredient1._id
      );
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      store.dispatch(addIngredient(mockIngredient1));
      store.dispatch(addIngredient(mockIngredient2));

      const stateBefore = store.getState().constructorState;
      const firstIngredient = stateBefore.constructorItems.ingredients[0];

      store.dispatch(moveUp(firstIngredient));

      const stateAfter = store.getState().constructorState;
      expect(stateAfter.constructorItems.ingredients[0]._id).toBe(
        mockIngredient1._id
      );
      expect(stateAfter.constructorItems.ingredients[1]._id).toBe(
        mockIngredient2._id
      );
    });
  });

  describe('moveDown', () => {
    it('должен перемещать ингредиент вниз в списке', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      store.dispatch(addIngredient(mockIngredient1));
      store.dispatch(addIngredient(mockIngredient2));
      store.dispatch(addIngredient(mockIngredient3));

      const stateBefore = store.getState().constructorState;
      const secondIngredient = stateBefore.constructorItems.ingredients[1];
      expect(stateBefore.constructorItems.ingredients[1]._id).toBe(
        mockIngredient2._id
      );

      store.dispatch(moveDown(secondIngredient));

      const stateAfter = store.getState().constructorState;
      expect(stateAfter.constructorItems.ingredients[1]._id).toBe(
        mockIngredient3._id
      );
      expect(stateAfter.constructorItems.ingredients[2]._id).toBe(
        mockIngredient2._id
      );
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      const store = configureStore({
        reducer: {
          constructorState: constructorSlice.reducer
        }
      });

      store.dispatch(addIngredient(mockIngredient1));
      store.dispatch(addIngredient(mockIngredient2));

      const stateBefore = store.getState().constructorState;
      const lastIngredient = stateBefore.constructorItems.ingredients[1];

      store.dispatch(moveDown(lastIngredient));

      const stateAfter = store.getState().constructorState;
      expect(stateAfter.constructorItems.ingredients[0]._id).toBe(
        mockIngredient1._id
      );
      expect(stateAfter.constructorItems.ingredients[1]._id).toBe(
        mockIngredient2._id
      );
    });
  });
});
