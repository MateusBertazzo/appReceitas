import React, { useEffect, useState } from 'react';
import { fetchApiMeals } from '../service/APIs';
import './InProgress.css';

function InProgressMeals(props) {
  const idProps = props;
  const { id } = idProps;
  const [filterMeals, setFilterMeals] = useState([]);
  const [filterObject, setFilterObject] = useState({});
  const [listChecked, setListChecked] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const api = await fetchApiMeals(id);
      const filteredApi = api.filter((meal) => meal.idMeal === id);
      setFilterMeals([...filteredApi]);
      setFilterObject(...filteredApi);
    };
    fetchApi();
  }, [setFilterMeals, id]);

  const objectEntries = Object.entries(filterObject);

  const getIngredients = objectEntries
    .filter((ingredient) => ingredient[0].includes('strIngredient'))
    .filter((ingredient) => ingredient[1] !== null && ingredient[1] !== '');

  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));

    if (inProgressRecipes && inProgressRecipes.meals && inProgressRecipes.meals[id]) {
      const listCheckedFromLocalStorage = inProgressRecipes.meals[id] || [];
      setListChecked(listCheckedFromLocalStorage);
    }
  }, [id]);

  const handleChange = ({ target }) => {
    target.parentElement.className = 'ingredients';
    const verify = listChecked.some((e) => e === target.value);
    if (!verify) {
      setListChecked([...listChecked, target.value]);
    } else {
      const filtered = listChecked.filter((e) => e !== target.value);
      setListChecked(filtered);
    }
  };

  useEffect(() => {
    const dataProgress = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || { meals: {} };
    const object = {
      ...dataProgress,
      meals: {
        ...dataProgress.meals,
        [id]: listChecked,
      } };
    localStorage.setItem('inProgressRecipes', JSON.stringify(object));
  }, [listChecked, id]);

  const isChecked = (ingredient) => listChecked.some((item) => item === ingredient);
  return (
    <div>
      {filterMeals.map((element, index) => (
        <section key={ index }>
          <img
            data-testid="recipe-photo"
            src={ element.strMealThumb }
            alt={ element.strArea }
          />
          <h1 data-testid="recipe-title">{element.strArea}</h1>
          <button
            type="button"
            data-testid="share-btn"
          >
            compartilhar
          </button>
          <button
            type="button"
            data-testid="favorite-btn"
          >
            favoritar
          </button>
          <p data-testid="recipe-category">{element.strCategory}</p>
          <h3>Instrução</h3>
          <p data-testid="instructions">
            {element.strInstructions}
          </p>
        </section>
      ))}
      {
        getIngredients.map((ingredient, index) => (
          <label
            key={ index }
            htmlFor={ ingredient[1] }
            data-testid={ `${index}-ingredient-step` }
            className={ isChecked(`${ingredient[1]}`) ? 'ingredients' : '' }
          >
            <input
              id={ ingredient[1] }
              checked={ isChecked(ingredient[1]) }
              type="checkbox"
              onChange={ handleChange }
              value={ ingredient[1] }
            />
            {ingredient[1]}
          </label>
        ))
      }
      <button
        type="button"
        data-testid="finish-recipe-btn"
      >
        Finalizar

      </button>
    </div>
  );
}

export default InProgressMeals;