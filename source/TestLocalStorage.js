window.addEventListener('DOMContentLoaded', init);

const displayBox = document.querySelector('#pref-display');

function init() {
    const addButton = document.querySelector('.add-ingredient-button');
    addButton.addEventListener('click', addIngredient);
    const boxLabel = document.createElement('div');
    boxLabel.textContent = 'Current Ingredients in Query:';
    boxLabel.append(document.createElement('ul'));
    displayBox.append(boxLabel);
    const existingPrefs = JSON.parse(localStorage.getItem('prefs'));
    document.querySelector('.remove-ingredient-button').addEventListener('click', removeIngredient);
    document.querySelector('.clear-prefs-button').addEventListener('click', clearPrefs);

    if (existingPrefs) {
        const ingredientList = existingPrefs['ingredients'];

        for (let i = 0; i < ingredientList.length; ++i) {
            const ingredientLabel = document.createElement('li');
            ingredientLabel.textContent = ingredientList[i];
            displayBox.append(ingredientLabel);
        }
    } else {
        window.localStorage.clear();
        const prefs = {
            userName: '',
            ingredients: [],
            vegan: false,
            vegetarian: false
        }
        window.localStorage.setItem('prefs', JSON.stringify(prefs));
        
    }
}

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
            ingredientLabel.setAttribute('id', ingredient);
            ingredientLabel.textContent = ingredient;
            displayBox.append(ingredientLabel);
        }
        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
        //document.querySelector('#pref-display').textContent = newPrefs;
    }
    addBox.value = '';
}

const removeIngredient = () => {
    const removeBox = document.querySelector('#remove-ingredient-box');
    const ingredient = removeBox.value;
    if (ingredient) {
        const local = window.localStorage;
        const prefs = JSON.parse(local.getItem('prefs'));
        const ingredientList = prefs['ingredients'];
        const idx = ingredientList.indexOf(ingredient);
        if (idx > -1) {
            ingredientList.splice(idx, 1);
            const ingredientLabel = document.querySelector(`#${ingredient}`);
            ingredientLabel.remove();
        }
        const newPrefs = JSON.stringify(prefs);
        local.setItem('prefs', newPrefs);
        //document.querySelector('#pref-display').textContent = newPrefs;
    }
    addBox.value = '';
}

/*
 * Extract the local data to be used for autofilling the query.
 */
const exportPrefs = () => {
    return JSON.parse(window.localStorage.getItem('prefs'));
}

/*
 * Clear the local preferences and update the html to remove our list of items
 */
const clearPrefs = () => {
    const ingredientList = JSON.parse(
        window.localStorage.getItem('prefs')
    )['ingredients'];
    for (let i = 0; i < ingredientList.length; ++i) {
        console.log(ingredientList[i]);
    }
    window.localStorage.clear();
}

/*
 * 
 */
const refreshBox = () => {
    for (let i = 0; i < ingredientList.length; ++i) {
        const ingredientLabel = document.createElement('li');
        ingredientLabel.textContent = ingredientList[i];
        displayBox.append(ingredientLabel);
    }
}