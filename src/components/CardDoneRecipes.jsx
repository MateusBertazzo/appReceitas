import React, { useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';

function CardDoneRecipes() {
  const [arrayDoneRecipes, setArrayDoneRecipes] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const [clipboard, setClipboard] = useState('');

  useEffect(() => {
    const arrayLocalStorage = JSON.parse(localStorage.getItem('doneRecipes')) || [];

    setArrayDoneRecipes(arrayLocalStorage);
    setFilteredArray(arrayLocalStorage);
  }, []);

  const copyLink = (param) => {
    if (param.type === 'drink') {
      copy(`http://localhost:3000/drinks/${param.id}`);
    } else {
      copy(`http://localhost:3000/meals/${param.id}`);
    }
    setClipboard('Link copied!');
  };

  const handleClick = (param) => {
    switch (param) {
    case 'Meals':
      setArrayDoneRecipes(filteredArray.filter((recipe) => recipe.type === 'meal'));
      break;
    case 'Drinks':
      setArrayDoneRecipes(filteredArray.filter((recipe) => recipe.type === 'drink'));
      break;
    default:
      setArrayDoneRecipes(filteredArray);
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
        arrayDoneRecipes.map((element, index) => (
          <div key={ element.name }>
            <Link to={ `${element.type}s/${element.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ element.image }
                alt={ element.name }
              />
              <p data-testid={ `${index}-horizontal-name` }>{element.name}</p>
            </Link>
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
            <p data-testid={ `${index}-horizontal-done-date` }>{element.doneDate}</p>
            <button
              type="button"
              data-testid={ `${index}-horizontal-share-btn` }
              src={ shareIcon }
              onClick={ () => copyLink(element) }
            >
              { shareIcon }
            </button>
            <p>{ clipboard }</p>
            {element.tags.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={ tagIndex }
                data-testid={ `${index}-${tag}-horizontal-tag` }
              >
                {tag}
              </span>
            ))}
          </div>
        ))
      }
    </section>
  );
}

export default CardDoneRecipes;
