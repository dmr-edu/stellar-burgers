import { FC, useEffect } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { getIngredients, ingredientsSelector } from '@slices';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
  }, []);
  const { ingredientsRequest } = useSelector(ingredientsSelector);

  return <ConstructorPageUI isIngredientsLoading={ingredientsRequest} />;
};
