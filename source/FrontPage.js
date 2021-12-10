import { runQuery } from './SpoonacularAPIWrapper.js';

window.addEventListener('DOMContentLoaded', init);

let prefsList;
const diets = ['No Restrictions', 'Gluten Free', 'Ketogenic', 'Vegetarian', 
    'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 
    'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP', 
    'Whole30'];


let recipes = [
    'recipes/batetaPoha.json',
    'recipes/ButternutSquashFrittata.json',
    'recipes/vietnamesePancakes.json',
    'recipes/lentilSoup.json',
    'recipes/mushroomtofusoup.json',
    'recipes/thaitofu.json',
    'recipes/jambalaya.json',
    'recipes/riceSalad.json',
    'recipes/nigeriansnailstew.json',
    'recipes/gingerbeefbroccoli.json',
    'recipes/beefstew.json',
    'recipes/stuffedpepper.json'
  ];

function shuffle(arr) {
    let l = arr.length;
    for (let i = 0; i < l; ++i) {
        let idx = parseInt(Math.random() * l);
        let temp = arr[i];
        arr[i] = arr[idx];
        arr[idx] = temp;
    }
}

// shuffle(recipes)

const recipeData = {}

async function init() {
    initializePrefsBox();

    // fetch the recipes and wait for them to load
    let fetchSuccessful = await loadRecommendations();
    // if they didn't successfully load, quit the function
    if (!fetchSuccessful) {
      console.log('Recipe fetch unsuccessful');
      return;
    };
    initializeRecommendations();
    console.log('recs created')
    // Add the first three recipe cards to the page
    createRecipeCards();
}

/*
 * Note: Local Preferences JSON is formatted like this:
 * {
 *     userName: '' (unused right now),
 *     ingredients: [] ([string]),
 *     diet: (undefined|string),
 *     key: string
 *  }
 */

/*
 * Initializes the display box and list for preferences.
 * Sets up the event listeners on the buttons, and 
 * uses existing preferences from the cache to prefill
 * the list. 
 */
function initializePrefsBox() {

    // make the title for prefs box
    const displayBox = document.querySelector('#pref-display');
    const boxLabel = document.createElement('strong');
    boxLabel.textContent = 'Current Ingredients in Local Preferences:';
    displayBox.append(boxLabel);

    // set up the list of preferences to fill in later
    const scrollableBox = document.createElement('div');
    scrollableBox.classList.add('local-prefs-list');
    prefsList = document.createElement('ul');
    scrollableBox.append(prefsList);
    displayBox.append(scrollableBox);

    // build dropdown list for diet options
    const dietDropdown = document.querySelector('#diet-dropdown');
    for (let i = 0; i < diets.length; ++i) {
        const dietOption = document.createElement('option');
        dietOption.setAttribute('value', diets[i]);
        dietOption.textContent = diets[i];
        dietDropdown.append(dietOption);
    }

    // make the buttons functional
    document.querySelector('.add-ingredient-button').addEventListener('click', addIngredient);
    document.querySelector('.clear-prefs-button').addEventListener('click', clearPrefs);
    document.querySelector('#diet-dropdown').addEventListener('change', e => { 
        if (diets.indexOf(e.target.value) > -1) {
            updatePrefs('diet', e.target.value);
        }
    });
    document.querySelector('.search-button').addEventListener('click', processSearch);

    // check for existing local prefs
    const existingPrefs = JSON.parse(localStorage.getItem('prefs'));
    if (existingPrefs) {
        const ingredientList = existingPrefs['ingredients'];

        // add existing prefs to page
        for (let i = 0; i < ingredientList.length; ++i) {
            addPrefItem(ingredientList[i]);
        }
        
        let idx = 0;
        if (existingPrefs['diet']) {
            const selectedDiet = existingPrefs['diet'];
            idx = diets.indexOf(selectedDiet);
            if (idx == -1) {
                idx = 0;
            }
        }
        document.querySelector('#diet-dropdown').selectedIndex = idx;

    } else {
        clearPrefs();
        
    }
    updatePrefs('key', '629aa421d4e743aeb717256cae557b27');
}

/*
 * Adds the ingredient specified to in the text box
 * with the id `add-ingredient-box`, then clears the
 * text box. If the ingredient already exists in the
 * preferences, then the function only clears the box.
 */
const addIngredient = () => {
    const addBox = document.querySelector('#add-ingredient-box');
    const ingredient = addBox.value;

    if (ingredient) {
        const local = window.localStorage;
        const prefs = JSON.parse(local.getItem('prefs'));
        if (!prefs){
            return; // prefs not found
        }
        const ingredientList = prefs['ingredients'];

        // if the ingredient is not in the list, add it
        if (ingredientList.indexOf(ingredient) < 0) {
            ingredientList.push(ingredient);
            addPrefItem(ingredient);
        }

        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
        local.setItem('new_flag', 1);

    }
    addBox.value = '';
}

/*
 * Helper method to handle building HTML for a single 
 * preference either when the page is initialized or
 * when the user adds more preferences.
 */
const addPrefItem = ingredient => {
    const ingredientItem = document.createElement('li');
    ingredientItem.setAttribute('id', `_prefs-ingredient-${ingredient}`);

    const ingredientBox = document.createElement('div');
    ingredientBox.textContent = `${ingredient} `;
    ingredientBox.classList.add('prefs-list-div');

    const removalButton = document.createElement('button');
    removalButton.textContent = 'Remove';
    removalButton.addEventListener('click', () => {
        removeIngredient(ingredient);
    });
    removalButton.setAttribute('id', `_prefs-ingredient-${ingredient}-remove`);
    ingredientBox.append(removalButton);
    ingredientItem.append(ingredientBox);
    prefsList.append(ingredientItem);
}

/*
 * Removes the ingredient specified by the argument `ingredient`.
 * Deletes associated HTML from the page
 * If the ingredient is not found, then the function does nothing.
 */
const removeIngredient = ingredient => {
    if (ingredient) {

        // grab the local storage and look for ingredient
        const local = window.localStorage;
        const prefs = JSON.parse(local.getItem('prefs'));
        if (!prefs){
            return; // prefs not found
        }
        const ingredientList = prefs['ingredients'];
        const idx = ingredientList.indexOf(ingredient);

        if (idx > -1) {
            // ingredient exists in our list, now remove it
            ingredientList.splice(idx, 1);
            const ingredientItem = document.querySelector(`#_prefs-ingredient-${ingredient}`);
            ingredientItem.remove();
        }

        // update local prefs with new list
        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
        local.setItem('new_flag', 1);
    }
}

/*
 * Extract the local data in object form to be used for 
 * autofilling the query in the API functions.
 */
const exportPrefs = () => {
    return JSON.parse(window.localStorage.getItem('prefs'));
}

/*
 * Clears the local preferences and updates the html to 
 * remove all the items from the list.
 */
const clearPrefs = () => {
    const items = prefsList.querySelectorAll('li');
    for (let i = 0; i < items.length; ++i){
        items[i].remove();
    }
    document.querySelector('#diet-dropdown').selectedIndex = 0;
    const oldPrefs = JSON.parse(window.localStorage.getItem('prefs'));
    let apiKey = undefined;
    if (oldPrefs) {
        apiKey = oldPrefs['key'];
    }
    const prefs = {
        userName: '',
        ingredients: [],
        diet: 'none',
        key: apiKey
    }
    window.localStorage.setItem('prefs', JSON.stringify(prefs));
    window.localStorage.removeItem('recommendations');
}

/*
 * Updates the preference option referred to by param `option` to be
 * set to the param `value`. Example updateValue('diet', 'vegan'); 
 */ 
const updatePrefs = (option, value) => {
    const prefs = JSON.parse(window.localStorage.getItem('prefs'));
    if (!prefs){
        return; // prefs not found
    }
    prefs[option] = value;
    window.localStorage.setItem('prefs', JSON.stringify(prefs));
}

/*
 * Adds an API key entered by user to local prefs
 */
const addKey = () => {
    const keyBox = document.querySelector('#add-api-key-box');
    const key = keyBox.value;
    keyBox.value = '';
    updatePrefs('key', key);
}


/*
 * Removes API key from local prefs
 */
const removeKey = () => {
    updatePrefs('key', undefined);
}


/*
 * Handles the search request by calling Spoonacular API wrapper
 * functions, then storing the data locally and redirecting the user
 * to the recipe page.
 */
async function processSearch() {
    const rawQuery = document.querySelector('#search-box').value;
    const splitQuery = rawQuery.split(',');
    const queryJSON = await runQuery(splitQuery, 1);
    if (queryJSON === 'fetch-failure') {
        alert('There was an error while fetching! Please check parameters and try again');
    } else if (queryJSON === 'no-results') {
        alert('No recipes found for this query!');
    } else if (queryJSON === undefined) {
        alert('Missing API key!');
    } else {
        window.localStorage.setItem('queryResult', JSON.stringify(queryJSON));
        window.location.href = './recipe-page.html?s=-1';
    }
}

/*
 * Utility function to simply pull the latest query
 */
const getLatestQuery = () => {
    return JSON.parse(window.localStorage.getItem('queryResult'));
}

async function loadRecommendations() {
    // Fill this in to populate recommendations
    return new Promise((resolve, reject) => {
        // This function is called in init()
        // From this function, you are going to fetch each of the recipes in the 'recipes' array above.
        // Once you have that data, store it in the 'recipeData' object. You can use whatever you like
        // for the keys. Once everything in the array has been successfully fetched, call the resolve(true)
        // callback function to resolve this promise. If there's any error fetching any of the items, call
        // the reject(false) function.
        const existingRecs = JSON.parse(window.localStorage.getItem('recommendations'));
        if (existingRecs != null) {
            console.log('creating recs from prefs');
            for (let i = 0; i < existingRecs.length; i++) {
                recipeData[i] = existingRecs[i];
                if (Object.keys(recipeData).length == existingRecs.length) {
                    console.log('fetch success');
                    resolve(true);
                }
            }
        } else {
            for (let i = 0; i < recipes.length; i++) {
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
                    });
            }
        }
    });
}

/*
 * Create recipe cards from const object
 */
function createRecipeCards() {
    let box = document.querySelector('.Top-Picks-box');
    if (Object.keys({}).length == 0){
        for (let i = 0; i < recipes.length; i++ ) {
            let recipe_card = document.createElement('recipe-card');
            recipe_card.data = {data: recipeData[i], num: i};
            box.appendChild(recipe_card);
        }
    } else {
        for (let i = 0; i < Object.keys({}).length; i++ ) {
            let recipe_card = document.createElement('recipe-card');
            recipe_card.data = {data: recipeData[i], num: i};
            box.appendChild(recipe_card);
        }
    }

    
}


/*
 * NOTE: Some utility functions repurposed from code provided for Lab Assignment
 */
class RecipeCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  
    set data(param) {
      var data = param.data;
      var num = param.num;

      if(data == null){
          return
      }
      // This is the CSS that you'll use for your recipe cards
      const styleEle = document.createElement('link');
      styleEle.setAttribute('rel', 'stylesheet');
      styleEle.setAttribute('href', 'front-page.css');
      
      // ============== Container for Whole Recipe Card ============== 
      // Here's the root element that you'll want to attach all of your other elements to
      const card = document.createElement('article');
      
      card.classList.add('recipe-card2');
      // ============== Container for Recipe Card Picture ============== 
      // Here is the top media part
      var media_div = document.createElement('div');
      media_div.classList.add('recipe-top-media');
      // get recipe image from recipe-card json
      var recipe_image = document.createElement('img');
      console.log('image', data.image);
      recipe_image.setAttribute('src', data.image);
      recipe_image.setAttribute('alt', data.title);
      recipe_image.classList.add('recipe-image');
      // Here is the icon part

      // fill our media container
      media_div.appendChild(recipe_image);
  
      // ============== Container for Recipe Card Text ============== 
      // Here is the text part div
      var text_div = document.createElement('recipe-title');
      text_div.classList.add('recipe-card-text');
      // get title image from recipe-card json
      var title= document.createElement('recipe-title');
      title.classList.add('recipe-title');
      // get link image from recipe-card json
      var title_link = document.createElement('a');
      var new_link = 'recipe-page.html?s='+num;
      title_link.setAttribute('href', new_link);
      title_link.innerHTML = searchForKey(data, 'title');
      title.appendChild(title_link);
  
      // get cooking time from 
      var time = document.createElement('time');
      time.innerHTML = '<b>Cook time: </b>' + searchForKey(data, 'readyInMinutes') + ' min';
      // restrictions
      var restrs = document.createElement('ul');
      restrs.classList.add('restrictions');
      for (let i = 0; i < data.diets.length && i < 3 ; i++) {
        let restriction = document.createElement('li');
        restriction.innerHTML = data.diets[i];
        restrs.appendChild(restriction);  
      }
      console.log('Ingredients', data.extendedIngredients[0]['original']);

      // get ingredients from 
      var pIngred = document.createElement('ul');
      pIngred.classList.add('ingredients');
      for (let i = 0; i < data.extendedIngredients.length; i++) {
        let ingredient = document.createElement('li');
        ingredient.innerHTML = data.extendedIngredients[i]['original'];
        pIngred.appendChild(ingredient);  
      }
      console.log('Ingredients', data.extendedIngredients[0]['original']);
      //console.log(data.extendedIngredients);
  
      // fill our text container
      text_div.appendChild(title);
      text_div.appendChild(time);
    //   text_div.appendChild(pIngred);
      text_div.appendChild(restrs);

      // fill our recipe cards
      card.appendChild(media_div);
      card.appendChild(text_div);
  
      this.shadowRoot.appendChild(styleEle);
      this.shadowRoot.appendChild(card);
    }
  }
  
  /**
   * Recursively search for a key nested somewhere inside an object
   * @param {Object} object the object with which you'd like to search
   * @param {String} key the key that you are looking for in the object
   * @returns {*} the value of the found key
   */
  function searchForKey(object, key) {
    var value;
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = searchForKey(object[k], key);
        return value !== undefined;
      }
    });
    return value;
  }
  
  async function initializeRecommendations() {
    const existingRecs = JSON.parse(window.localStorage.getItem('recommendations'));
    const existingPrefs = JSON.parse(window.localStorage.getItem('prefs'));
    const newFlag = JSON.parse(window.localStorage.getItem('new_flag'));
    if ((!existingRecs && existingPrefs['ingredients'].length > 0) || (newFlag == 1 && existingPrefs['ingredients'].length > 0)  ) {
        console.log('in if')
        const newRecs = await runQuery([], 12); // TODO change 4 to 9?
        if (newRecs === 'fetch-failure') {
            console.log('fetch-failure')
            // ignore for now
        } else if (newRecs === 'no-results') {
            console.log('no-results')
            // ignore for now
        } else if (newRecs === undefined) {
            console.log('undefined')
            // ignore for now
        } else {
            // add in the recs locally if we got something
            console.log('else')
            window.localStorage.setItem('recommendations', JSON.stringify(newRecs));
        }
    }
    window.localStorage.setItem('new_flag', 0);
}

  // Define the Class so you can use it as a custom element.
  // This is critical, leave this here and don't touch it
  customElements.define('recipe-card', RecipeCard);

export { exportPrefs, getLatestQuery };

