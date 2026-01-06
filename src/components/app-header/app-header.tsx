import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { userSelector } from '@slices';

export const AppHeader: FC = () => {
  const { data: user } = useSelector(userSelector);

  return <AppHeaderUI userName={user?.name} />;
};
