window.addEventListener('DOMContentLoaded', init);

let prefsList;

function init() {
    initializePrefsBox();
}

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
    boxLabel.textContent = 'Current Ingredients in Query:';
    displayBox.append(boxLabel);

    // set up the list of preferences to fill in later
    const scrollableBox = document.createElement('div');
    scrollableBox.setAttribute('style', 'height:75px;overflow:scroll');
    prefsList = document.createElement('ul');
    scrollableBox.append(prefsList);
    displayBox.append(scrollableBox);

    // make the buttons functional
    document.querySelector('.add-ingredient-button').addEventListener('click', addIngredient);
    document.querySelector('.remove-ingredient-button').addEventListener('click', removeIngredient);
    document.querySelector('.clear-prefs-button').addEventListener('click', clearPrefs);
    document.querySelector('#vegan-dropdown').addEventListener('change', e => { 
        updatePrefs('vegan', e.target.value === 'true');
    });
    document.querySelector('#vegetarian-dropdown').addEventListener('change', e => { 
        updatePrefs('vegetarian', e.target.value === 'true');
    });

    const existingPrefs = JSON.parse(localStorage.getItem('prefs'));
    if (existingPrefs) {
        const ingredientList = existingPrefs['ingredients'];

        for (let i = 0; i < ingredientList.length; ++i) {
            const ingredientLabel = document.createElement('li');
            ingredientLabel.setAttribute('id', `_prefs-ingredient-${ingredientList[i]}`);
            ingredientLabel.textContent = ingredientList[i];
            prefsList.append(ingredientLabel);
        }

        if (existingPrefs['vegan'] === undefined) {
            document.querySelector('#vegan-dropdown').selectedIndex = 0;
        } else {
            const result = existingPrefs['vegan'];
            document.querySelector('#vegan-dropdown').selectedIndex = result ? 1 : 2;
        }

        if (existingPrefs['vegetarian'] === undefined) {
            document.querySelector('#vegetarian-dropdown').selectedIndex = 0;
        } else {
            const result = existingPrefs['vegetarian'];
            document.querySelector('#vegetarian-dropdown').selectedIndex = result ? 1 : 2;
        }

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
    document.querySelector('#vegan-dropdown').selectedIndex = 0;
    document.querySelector('#vegetarian-dropdown').selectedIndex = 0;
    window.localStorage.clear(); // may remove later if we store other stuff locally
    const prefs = {
        userName: '',
        ingredients: [],
        vegan: undefined,
        vegetarian: undefined
    }
    window.localStorage.setItem('prefs', JSON.stringify(prefs));
}

/*
 * Updates the preference option referred to by param `option` to be
 * set to the param `value`. Example updateValue('vegan', true); 
 */ 
const updatePrefs = (option, value) => {
    const prefs = JSON.parse(window.localStorage.getItem('prefs'));
    prefs[option] = value;
    window.localStorage.setItem('prefs', JSON.stringify(prefs));
}