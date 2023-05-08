import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import context from '../contexts/MyContext';
import { mealsIngredients, mealsNames, mealsFirstLetter,
  drinkIngredients, drinkNames, drinkFirstLetter } from '../service/APIs';

function SearchBar() {
  const { inputApi, setFilterData, filterData, setClickedFilter } = useContext(context);
  const { pathname } = useLocation();
  const [radio, setRadio] = useState('');

  const history = useHistory();

  const handleChange = ({ target: { value } }) => {
    setRadio(value);
  };

  const getMealsApi = async () => {
    if (radio === 'ingredient') {
      const filterIngredients = await mealsIngredients(inputApi);
      setFilterData(filterIngredients || []);
    }
    if (radio === 'name') {
      const filterName = await mealsNames(inputApi);
      setFilterData(filterName || []);
    }
    if (radio === 'first-letter') {
      if (inputApi.length === 1) {
        const filterLetter = await mealsFirstLetter(inputApi);
        setFilterData(filterLetter || []);
      } else {
        global.alert('Your search must have only 1 (one) character');
      }
    }
  };

  const getDrinksApi = async () => {
    if (radio === 'ingredient') {
      const filterIngredients = await drinkIngredients(inputApi);
      setFilterData(filterIngredients || []);
    }
    if (radio === 'name') {
      const filterName = await drinkNames(inputApi);
      setFilterData(filterName || []);
    }
    if (radio === 'first-letter') {
      if (inputApi.length === 1) {
        const filterLetter = await drinkFirstLetter(inputApi);
        setFilterData(filterLetter || []);
      } else {
        global.alert('Your search must have only 1 (one) character');
      }
    }
  };

  const verifyData = (param) => {
    if (filterData.length === 1) {
      history.push(`/${param}/${filterData[0].idMeal}`);
    }
  };

  const handleClick = async () => {
    setClickedFilter(true);
    setFilterData([]);
    if (pathname === '/meals') {
      getMealsApi();
      verifyData('meals');
    }
    if (pathname === '/drinks') {
      getDrinksApi();
      verifyData('drinks');
    }
  };

  return (
    <nav>
      <div
        onChange={ handleChange }
      >
        <label>
          <input
            name="filter"
            type="radio"
            data-testid="ingredient-search-radio"
            value="ingredient"
          />
          Ingredient
        </label>
        <label>
          <input
            name="filter"
            type="radio"
            data-testid="name-search-radio"
            value="name"
          />
          Name
        </label>
        <label>
          <input
            name="filter"
            type="radio"
            data-testid="first-letter-search-radio"
            value="first-letter"
          />
          First letter
        </label>
      </div>
      <button
        data-testid="exec-search-btn"
        onClick={ handleClick }
      >
        Search

      </button>
    </nav>
  );
}

export default SearchBar;
