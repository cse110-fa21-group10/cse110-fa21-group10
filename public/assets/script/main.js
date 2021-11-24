// main.js

// Here is where the recipes that you will fetch.
const recipes = [
    'assets/recipes/sample-recipe.json'
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
    // Make the "Show more" button functional
    bindShowMore();
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
          recipeData[recipes[i]] = data;
          if (Object.keys(recipeData).length == recipes.length) {
            resolve(true);
          }
        })
        .catch(error => {
          reject(false);
        })
      }
    });
  }
  
  function createRecipeCards() {
    // This function is called for you up above.
    // From within this function you can access the recipe data from the JSON 
    // files with the recipeData Object above. Make sure you only display the 
    // three recipes we give you, you'll use the bindShowMore() function to
    // show any others you've added when the user clicks on the "Show more" button.
  
    var box = document.querySelector('.Top-Picks-box');
    console.log(recipeData);
    for(let i = 0; i < 9; i ++) {
      let recipe_card = document.createElement('recipe-card');
      recipe_card.data = recipeData[recipes[i]];
      box.appendChild(recipe_card);
    }
  }