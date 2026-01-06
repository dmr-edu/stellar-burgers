import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { getOrders, ordersSelector, userSelector } from '@slices';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, ordersRequest } = useSelector(ordersSelector);
  const { isAuthenticated } = useSelector(userSelector);

  useEffect(() => {
    // Загружаем заказы только если пользователь авторизован
    if (isAuthenticated) {
      dispatch(getOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (ordersRequest) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
