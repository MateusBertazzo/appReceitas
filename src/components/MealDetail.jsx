import React, { useEffect, useState, useContext } from 'react';
import copy from 'clipboard-copy';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Recommendations from './Recommendations';
import shareIcon from '../images/shareIcon.svg';
import context from '../contexts/MyContext';
import './Footer.css';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function MealDetails({ pathname }) {
  const { id } = useParams(); // Hook usado para pegar o ID que está na URL exemplo e logo em seguida fazer o fetch usando o mesmo
  const history = useHistory();

  const [recipeArrayMeal, setRecipeArrayMeal] = useState([]);
  const [recipeObjectMeal, setRecipeObjectMeal] = useState({});
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [verifyIsFavorite, setVerifyIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]); /* Array onde irei guardar meus favoritos */
  const { dataDrinks } = useContext(context);
  const [clipboard, setClipboard] = useState('');

  const clipboardClick = () => {
    copy(`http://localhost:3000/meals/${id}`);
    setClipboard('Link copied!');
  };

  useEffect(() => {
    const fetchApi = async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      setRecipeArrayMeal([...data.meals]);
      setRecipeObjectMeal(...data.meals);
    };
    fetchApi();
  }, [id]);

  useEffect(() => {
    const getIdDoneRecipe = JSON
      .parse(localStorage.getItem('inProgressRecipes')) || {};

    if (!Object.keys(getIdDoneRecipe).includes('meals')) {
      setVerifyInProgress(false);
    } else {
      setVerifyInProgress(Object.keys(getIdDoneRecipe.meals).includes(id));
    }
  }, []);

  const objectEntries = Object.entries(recipeObjectMeal);

  const getIngredients = objectEntries
    .filter((ingredient) => ingredient[0].includes('strIngredient'))
    .filter((ingredient) => ingredient[1] !== null);

  const getMeasures = objectEntries
    .filter((measure) => measure[0].includes('strMeasure'))
    .filter((measure) => measure[1] !== ' ');

  useEffect(() => {
    const getFavoritesFromLocalStorage = JSON
      .parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavorites(getFavoritesFromLocalStorage);

    const checkedIsFavorite = getFavoritesFromLocalStorage
      .some((recipe) => recipe.id === id);
    setVerifyIsFavorite(checkedIsFavorite);
  }, [id]);

  const handleClick = () => {
    if (verifyIsFavorite) {
      const updateFavorites = favorites.filter((recipe) => recipe.id !== id);
      setFavorites(updateFavorites);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updateFavorites));
      setVerifyIsFavorite(false);
    } else {
      const setFavoritesLocalStorage = [...favorites, {
        id: recipeObjectMeal.idMeal,
        type: 'meal',
        nationality: recipeObjectMeal.strArea,
        category: recipeObjectMeal.strCategory,
        alcoholicOrNot: '',
        name: recipeObjectMeal.strMeal,
        image: recipeObjectMeal.strMealThumb,
      }];
      setFavorites(setFavoritesLocalStorage);
      localStorage.setItem('favoriteRecipes', JSON.stringify(setFavoritesLocalStorage));
      setVerifyIsFavorite(true);
    }
  };

  return (
    <div>
      { recipeArrayMeal
        .map(
          ({
            idMeal, strMeal, strCategory, strInstructions, strMealThumb, strYoutube,
          }) => (
            <div key={ idMeal }>
              <h3 data-testid="recipe-title">
                {strMeal}
              </h3>
              <img
                src={ strMealThumb }
                alt={ strMeal }
                data-testid="recipe-photo"
              />
              <p data-testid="recipe-category">
                {strCategory}
              </p>
              <button
                type="button"
                data-testid="share-btn"
                onClick={ clipboardClick }
              >
                <img
                  src={ shareIcon }
                  alt="shareIcon"
                />
              </button>
              <p>{ clipboard }</p>
              <p data-testid="instructions">
                {strInstructions}
              </p>
              <iframe
                title={ `Receita: ${strMeal}` }
                width="560"
                height="315"
                allow="accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture"
                allowFullScreen
                src={ strYoutube.replace('watch?v=', 'embed/') }
                data-testid="video"
              >
                Click me
              </iframe>
              <button
                onClick={ handleClick }
                type="button"
                data-testid="favorite-btn"
                src={ verifyIsFavorite ? blackHeartIcon : whiteHeartIcon }
              >
                <img
                  src={ verifyIsFavorite ? blackHeartIcon : whiteHeartIcon }
                  alt={ verifyIsFavorite ? 'blackHeartIcon' : 'whiteHeartIcon' }
                />

              </button>
            </div>
          ),
        )}
      <div>
        {
          getMeasures.map((measure, index) => (
            <p
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              { measure[1] }
            </p>
          ))
        }
        {
          getIngredients.map((ingredient, index) => (
            <p
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {ingredient[1]}
            </p>
          ))
        }
      </div>

      <Recommendations data={ dataDrinks } pageTypes="drinks" />

      <button
        type="button"
        className="btn"
        data-testid="start-recipe-btn"
        onClick={ () => history.push(`${pathname}/in-progress`) }
      >
        {
          verifyInProgress ? 'Continue Recipe' : 'Start Recipe'
        }
      </button>

    </div>
  );
}

MealDetails.propTypes = {
  pathname: PropTypes.func,
}.isRequired;

export default MealDetails;
