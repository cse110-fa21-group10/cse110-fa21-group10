import { runQuery } from './SpoonacularAPIWrapper.js';

window.addEventListener('DOMContentLoaded', init);

let prefsList;
const diets = ['None', 'Gluten Free', 'Ketogenic', 'Vegetarian', 
    'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 
    'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP', 
    'Whole30'];

function init() {
    initializePrefsBox();
    await loadRecommendations();
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
    document.querySelector('.remove-ingredient-button').addEventListener('click', removeIngredient);
    document.querySelector('.clear-prefs-button').addEventListener('click', clearPrefs);
    document.querySelector('#diet-dropdown').addEventListener('change', e => { 
        if (diets.indexOf(e.target.value) > -1) {
            updatePrefs('diet', e.target.value);
        }
    });
    document.querySelector('.add-api-key-button').addEventListener('click', addKey);
    document.querySelector('.remove-api-key-button').addEventListener('click', removeKey);
    document.querySelector('.search-button').addEventListener('click', processSearch);

    // check for existing local prefs
    const existingPrefs = JSON.parse(localStorage.getItem('prefs'));
    if (existingPrefs) {
        const ingredientList = existingPrefs['ingredients'];

        // add existing prefs to page
        for (let i = 0; i < ingredientList.length; ++i) {
            const ingredientLabel = document.createElement('li');
            ingredientLabel.setAttribute('id', `_prefs-ingredient-${ingredientList[i]}`);
            ingredientLabel.textContent = ingredientList[i];
            prefsList.append(ingredientLabel);
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
        const ingredientList = prefs['ingredients'];

        // if the ingredient is not in the list, add it
        if (ingredientList.indexOf(ingredient) < 0) {
            ingredientList.push(ingredient);
            const ingredientLabel = document.createElement('li');
            ingredientLabel.setAttribute('id', `_prefs-ingredient-${ingredient}`);
            ingredientLabel.textContent = ingredient;
            prefsList.append(ingredientLabel);
        }

        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
    }
    addBox.value = '';
}

/*
 * Removes the ingredient specified to in the text box
 * with the id `remove-ingredient-box`, then clears the
 * text box. If the ingredient is not found, then the 
 * function only clears the box.
 */
const removeIngredient = () => {
    const removeBox = document.querySelector('#remove-ingredient-box');
    const ingredient = removeBox.value;
    if (ingredient) {

        // grab the local storage and look for ingredient
        const local = window.localStorage;
        const prefs = JSON.parse(local.getItem('prefs'));
        const ingredientList = prefs['ingredients'];
        const idx = ingredientList.indexOf(ingredient);

        if (idx > -1) {
            // ingredient exists in our list, now remove it
            ingredientList.splice(idx, 1);
            const ingredientLabel = document.querySelector(`#_prefs-ingredient-${ingredient}`);
            ingredientLabel.remove();
        }

        // update local prefs with new list
        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
    }
    removeBox.value = '';
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
    //window.localStorage.clear(); // may remove later if we store other stuff locally
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
}

/*
 * Updates the preference option referred to by param `option` to be
 * set to the param `value`. Example updateValue('diet', 'vegan'); 
 */ 
const updatePrefs = (option, value) => {
    const prefs = JSON.parse(window.localStorage.getItem('prefs'));
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

async function processSearch() {
    const rawQuery = document.querySelector('#search-box').value;
    const splitQuery = rawQuery.split(',');
    const queryJSON = await runQuery(splitQuery);
    if (queryJSON === 'fetch-failure') {
        alert('There was an error while fetching! Please check parameters and try again');
    } else if (queryJSON === 'no-results') {
        alert('No recipes found for this query!');
    } else if (queryJSON === undefined) {
        alert('Missing API key!');
    } else {
        window.localStorage.setItem('queryResult', JSON.stringify(queryJSON));
        window.location.href = './recipe-page.html';
        // TODO fill in link here to recipe page
    }
    //console.log(getLatestQuery());
}

const getLatestQuery = () => {
    return JSON.parse(window.localStorage.getItem('queryResult'));
}

async function loadRecommendations() {
    // TODO: Fill this in to populate recommendations
}



export { exportPrefs, getLatestQuery };
