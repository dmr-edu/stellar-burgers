import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { getOrders, ordersSelector, userSelector } from '@slices';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, ordersRequest, ordersError } = useSelector(ordersSelector);
  const { isAuthenticated, isAuthChecked } = useSelector(userSelector);

  useEffect(() => {
    // Загружаем заказы только после проверки авторизации и если пользователь авторизован
    if (isAuthChecked && isAuthenticated) {
      dispatch(getOrders());
    }
  }, [dispatch, isAuthChecked, isAuthenticated]);

  if (!isAuthChecked || ordersRequest) {
    return <Preloader />;
  }

  if (ordersError) {
    return (
      <div
        className='text text_type_main-medium'
        style={{ textAlign: 'center', padding: '20px' }}
      >
        Ошибка загрузки заказов: {ordersError}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
