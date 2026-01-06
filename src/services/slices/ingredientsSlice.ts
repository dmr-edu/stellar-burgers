import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsStore = {
  ingredients: {
    buns: TIngredient[];
    mains: TIngredient[];
    sauces: TIngredient[];
  };
  ingredientsRequest: boolean;
  ingredientsError: string | null;
};

const initialState: TIngredientsStore = {
  ingredients: {
    buns: [],
    mains: [],
    sauces: []
  },
  ingredientsError: null,
  ingredientsRequest: false
};

export const getIngredients = createAsyncThunk('ingredients/list', async () =>
  getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.ingredientsRequest = true;
        state.ingredientsError = null;
        state.ingredientsError = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.ingredientsRequest = false;
        state.ingredientsError = action.error.message || null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = {
          buns: [],
          mains: [],
          sauces: []
        };
        action.payload.forEach((item) => {
          switch (item.type) {
            case 'bun': {
              return state.ingredients.buns.push(item);
            }
            case 'main': {
              return state.ingredients.mains.push(item);
            }
            case 'sauce': {
              return state.ingredients.sauces.push(item);
            }
          }
        });
        state.ingredientsRequest = false;
      });
  }
});

export const { ingredientsSelector } = ingredientsSlice.selectors;
