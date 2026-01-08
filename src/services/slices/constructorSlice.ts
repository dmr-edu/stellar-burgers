import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';
import { v4 as uuidv4 } from 'uuid';

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

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const constructorSlice = createSlice({
  name: 'constructorState',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      const bunWithId: TConstructorIngredient = {
        ...action.payload,
        id: uuidv4()
      };
      state.constructorItems.bun = bunWithId;
    },
    moveUp: (state, action: PayloadAction<TConstructorIngredient>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (i) => i?.id === action.payload?.id
      );
      if (currentIndex <= 0) return;
      const tmp = state.constructorItems.ingredients[currentIndex - 1];
      state.constructorItems.ingredients[currentIndex - 1] = action.payload;
      state.constructorItems.ingredients[currentIndex] = tmp;
    },
    moveDown: (state, action: PayloadAction<TConstructorIngredient>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (i) => i?.id === action.payload?.id
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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredientWithId: TConstructorIngredient = {
        ...action.payload,
        id: uuidv4()
      };
      state.constructorItems.ingredients.push(ingredientWithId);
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient['id']>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    }
  },
  selectors: {
    constructorSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // Очистить конструктор после успешного заказа
        state.constructorItems = { bun: null, ingredients: [] };
      });
  }
});

export const { constructorSelector } = constructorSlice.selectors;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  closeOrderModal,
  clearConstructor
} = constructorSlice.actions;
