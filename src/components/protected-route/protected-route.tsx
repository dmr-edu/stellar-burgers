import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { userSelector } from '@slices';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const { isAuthChecked, isAuthenticated } = useSelector(userSelector);
  const location = useLocation();

  // Пока идет проверка авторизации - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут требует авторизации, а пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    // Сохраняем текущий маршрут в state для возврата после авторизации
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для неавторизованных (login/register), а пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    // Возвращаем на исходный маршрут или на главную
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  return children;
};
