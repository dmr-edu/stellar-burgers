import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@store';
import { ingredientsSelector, feedSelector, getOrderByNumber } from '@slices';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const { ingredients: ingredientsData } = useSelector(ingredientsSelector);
  const { currentOrder, orderRequest, orderError } = useSelector(feedSelector);

  // Получаем все ингредиенты из store
  const ingredients: TIngredient[] = [
    ...ingredientsData.buns,
    ...ingredientsData.mains,
    ...ingredientsData.sauces
  ];

  useEffect(() => {
    if (!number) {
      return;
    }

    const orderNumber = parseInt(number, 10);
    if (isNaN(orderNumber)) {
      return;
    }

    dispatch(getOrderByNumber(orderNumber));
  }, [number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (orderRequest || !ingredients.length) {
    return (
      <p className='text text_type_main-medium' style={{ textAlign: 'center' }}>
        Загрузка...
      </p>
    );
  }

  if (orderError || !orderInfo) {
    return (
      <div>Ошибка: {orderError || 'Не удалось загрузить данные заказа'}</div>
    );
  }

  return (
    <>
      <p
        className='text text_type_digits-default'
        style={{ textAlign: 'center' }}
      >
        #{number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
