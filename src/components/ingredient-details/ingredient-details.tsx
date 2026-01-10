import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '@store';
import { ingredientsSelector } from '@slices';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ingredients: ingredientsData } = useSelector(ingredientsSelector);

  // Находим ингредиент по id из всех категорий
  const ingredientData = useMemo<TIngredient | null>(() => {
    if (!id) return null;

    const allIngredients: TIngredient[] = [
      ...ingredientsData.buns,
      ...ingredientsData.mains,
      ...ingredientsData.sauces
    ];

    return allIngredients.find((ing) => ing._id === id) || null;
  }, [id, ingredientsData]);

  if (
    !ingredientsData.buns.length &&
    !ingredientsData.mains.length &&
    !ingredientsData.sauces.length
  ) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <>
      <p className='text text_type_main-medium' style={{ textAlign: 'center' }}>
        Детали ингредиента
      </p>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
