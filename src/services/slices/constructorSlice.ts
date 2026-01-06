import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

type TConstructorItem = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TConstructorState = {
  constructorItems: TConstructorItem;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'constructorState',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TConstructorItem['bun']>) => {
      state.constructorItems.bun = action.payload;
    },
    moveUp: (state, action: PayloadAction<TConstructorIngredient>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (i) => i?._id === action.payload?._id
      );
      if (!currentIndex) return;
      const tmp = state.constructorItems.ingredients[currentIndex - 1];
      state.constructorItems.ingredients[currentIndex - 1] = action.payload;
      state.constructorItems.ingredients[currentIndex] = tmp;
    },
    moveDown: (state, action: PayloadAction<TConstructorIngredient>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (i) => i?._id === action.payload?._id
      );
      if (
        currentIndex < 0 ||
        !state.constructorItems.ingredients?.at(currentIndex + 1)
      )
        return;
      const tmp = state.constructorItems.ingredients[currentIndex + 1];
      state.constructorItems.ingredients[currentIndex + 1] = action.payload;
      state.constructorItems.ingredients[currentIndex] = tmp;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient['_id']>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient._id !== action.payload
        );
    }
  },
  selectors: {
    constructorSelector: (state) => state
  }
});

export const { constructorSelector } = constructorSlice.selectors;
export const { setBun, addIngredient, removeIngredient, moveUp, moveDown } =
  constructorSlice.actions;
