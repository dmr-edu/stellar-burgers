import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useSelector } from '@store';
import { ingredientsSelector } from '@slices';

export const ConstructorPage: FC = () => {
  const { ingredientsRequest } = useSelector(ingredientsSelector);

  return <ConstructorPageUI isIngredientsLoading={ingredientsRequest} />;
};
