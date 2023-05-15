import React, { useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function CardFavoriteRecipes() {
  const [arrayFavorite, setArrayFavorite] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const [clipboard, setClipboard] = useState('');

  useEffect(() => {
    const getLocalStorage = () => {
      const arrayLocalStorage = JSON
        .parse(localStorage.getItem('favoriteRecipes')) || [];

      setArrayFavorite(arrayLocalStorage);
      setFilteredArray(arrayLocalStorage);
    };
    getLocalStorage();
  }, []);

  const copyLink = (param) => {
    if (param.type === 'drink') {
      copy(`http://localhost:3000/drinks/${param.id}`);
    } else {
      copy(`http://localhost:3000/meals/${param.id}`);
    }
    setClipboard('Link copied!');
  };

  const FavoriteButton = (element) => {
    const arrayLocalStorage = JSON
      .parse(localStorage.getItem('favoriteRecipes')) || [];

    const arrayFiltered = arrayLocalStorage
      .filter((recipe) => recipe.id !== element.id);

    localStorage.setItem('favoriteRecipes', JSON.stringify(arrayFiltered));

    setArrayFavorite(arrayFiltered);
  };

  // const handleClick = (param) => {
  //   if (param === 'Meals') {
  //     setArrayFavorite(arrayFavorite.filter((element) => element.type === 'meal'));
  //   } if (param === 'Drinks') {
  //     setArrayFavorite(arrayFavorite.filter((element) => element.type === 'drink'));
  //   } if (param === 'All') {
  //     setArrayFavorite(filteredArray);
  //   }
  // };

  const handleClick = (param) => {
    switch (param) {
    case 'Meals':
      setArrayFavorite(filteredArray.filter((recipe) => recipe.type === 'meal'));
      break;
    case 'Drinks':
      setArrayFavorite(filteredArray.filter((recipe) => recipe.type === 'drink'));
      break;
    default:
      setArrayFavorite(filteredArray);
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={ () => handleClick('Meals') }
        data-testid="filter-by-meal-btn"
      >
        Meals

      </button>
      <button
        type="button"
        onClick={ () => handleClick('Drinks') }
        data-testid="filter-by-drink-btn"
      >
        Drinks

      </button>
      <button
        type="button"
        onClick={ () => handleClick('All') }
        data-testid="filter-by-all-btn"
      >
        All

      </button>
      {
        arrayFavorite.map((element, index) => (
          <div key={ element.name }>
            <Link to={ `${element.type}s/${element.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ element.image }
                alt={ element.name }
              />
              <p data-testid={ `${index}-horizontal-name` }>{element.name}</p>
            </Link>
            <p data-testid={ `${index}-horizontal-top-text` }>{element.category}</p>
            {element.type !== 'drink'
              ? (
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {`${element.nationality} - ${element.category}`}
                </p>
              )
              : (
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                >
                  {element.alcoholicOrNot}
                </p>
              )}
            <button
              type="button"
              data-testid={ `${index}-horizontal-share-btn` }
              src={ shareIcon }
              onClick={ () => copyLink(element) }
            >
              { shareIcon }
            </button>
            <button
              type="button"
              data-testid={ `${index}-horizontal-favorite-btn` }
              onClick={ () => FavoriteButton(element) }
              src={ blackHeartIcon }
            >
              <img
                src={ blackHeartIcon }
                alt="blackHeartIcon"
              />
            </button>
            <p>{ clipboard }</p>
          </div>
        ))
      }
    </section>
  );
}

export default CardFavoriteRecipes;
