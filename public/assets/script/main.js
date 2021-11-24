  // main.js

  // Here is where the recipes that you will fetch.
  const recipes = [
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
    'assets/recipes/sample-recipe.json',
  ];
  
  // Once all of the recipes that were specified above have been fetched, their
  // data will be added to this object below. You may use whatever you like for the
  // keys as long as it's unique, one suggestion might but the URL itself
  const recipeData = {}
  
  window.addEventListener('DOMContentLoaded', init);
  
  // This is the first function to be called, so when you are tracing your code start here.
  async function init() {
    // fetch the recipes and wait for them to load
    let fetchSuccessful = await fetchRecipes();
    // if they didn't successfully load, quit the function
    if (!fetchSuccessful) {
      console.log('Recipe fetch unsuccessful');
      return;
    };
    // Add the first three recipe cards to the page
    createRecipeCards();
    loadAdvancedSearch();
  }
  
  async function fetchRecipes() {
    return new Promise((resolve, reject) => {
      // This function is called for you up above
      // From this function, you are going to fetch each of the recipes in the 'recipes' array above.
      // Once you have that data, store it in the 'recipeData' object. You can use whatever you like
      // for the keys. Once everything in the array has been successfully fetched, call the resolve(true)
      // callback function to resolve this promise. If there's any error fetching any of the items, call
      // the reject(false) function.

      for(let i = 0; i < recipes.length; i ++) {
        fetch(recipes[i])
        .then(response => response.json())
        .then(data => {
          recipeData[i] = data;
          if (Object.keys(recipeData).length == recipes.length) {
            console.log('fetch success');
            resolve(true);
          }
        })
        .catch(error => {
          console.log(error);
          reject(false);
        })
      }
    });
  }
  
  function createRecipeCards() {
    let box = document.querySelector('.Top-Picks-box');
    for(let i = 0; i < recipes.length; i ++) {
      let recipe_card = document.createElement('recipe-card');
      recipe_card.data = recipeData[i];
      box.appendChild(recipe_card);
    }
  }

  function loadAdvancedSearch() {
    const search_box = document.querySelector('.search-box');
    const search_button = document.querySelector('.search-btn');

    search_button.addEventListener('click', () => {
      // placeholder for content in search box
      let search_content = document.querySelector('.search-txt').innerHTML;

      let search_component= document.createElement('advanced-search');
      let recipe_card = document.createElement('recipe-card');
      let result_box = document.createElement('div');
      let recipe_result = document.createElement('h3');
      recipe_result.innerHTML = 'Search Result';

      recipe_card.data = recipeData[0];
      result_box.appendChild(recipe_result);
      search_box.appendChild(search_component);
      search_box.appendChild(result_box);
      search_box.appendChild(recipe_card);
    });
  }