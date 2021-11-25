import { exportPrefs } from './FrontPage.js';

//window.addEventListener('DOMContentLoaded', init);

// TODO: replace with different key when expired
// WARNING: each key only has 150 points per day, right now each rerun
//          of this script costs about 2.5 points, so don't save and rerun
//          too many times (or make a new account for a new key)
const key = '';

const baseURL = 'https://api.spoonacular.com/recipes/';

/*async function init() {
    const initialData = [];
    let dummyIngredients = ["apples", "flour", "sugar"]; // List of ingredients to search for
    let numToFetch = "2"; // Number of results
    let dummyDiet = "vegetarian";    // Diet option to search for
    let ingredientQuery = getIngredientQuery(dummyIngredients); // Processes list of ings to proper format
    let initialQueryStr = `${baseURL}complexSearch?apiKey=${key}&includeIngredients=${ingredientQuery}&diet=${dummyDiet}&number=${numToFetch}`;
    let fetchSuccessful = await fetchJSON(initialQueryStr, initialData);
    if (!fetchSuccessful) {
        console.log("Recipes were not fetched successfully from ingredients");
        return;
    }

    let JSONquery = processInitialResult(initialData);

    const JSONresult = [];
    if (!JSONquery.length) return;
    let recipeQuery = "";
    for (let i = 0; i < JSONquery.length; i++) {
        recipeQuery = `${baseURL}${JSONquery[i]}/information?apiKey=${key}`;
        fetchSuccessful = await fetchJSON(recipeQuery, JSONresult);
        if (!fetchSuccessful) {
            console.log("Full JSONs not fetched successfully");
            return;
        }
    }
    console.log(JSONresult);
    console.log("DONE!");

}*/

/*
 * Async function based on Lab 6
 * Parses JSON into an array from URL
 * TODO: Make error messages more verbose
*/
async function fetchJSON(URL, arr) {
    return new Promise( (resolve, reject) => {
        fetch(URL)
          .then(function(response) {
              if (!response.ok) {
                  throw new Error("error occured");
              }
              return response.json();
          })
          .then(function(json) {
              if (json.length > 1) {
                for (let i = 0; i < json.length; i++) {
                    arr.push(json[i]);
                }
                if (arr.length == json.length) resolve(true);
              }
              else {
                  arr.push(json);
                  resolve(true);
              }
          })
          .catch(function(error) {
              console.error("Problem with fetching:", error);
              reject(false);
          })
    });
}

/*
 * Function that will get and process ingredient query from frontend
 * Not yet sure how connection to frontend works
 * So only the processing part is implemented
 * Will process a given array of comma separated strings into one string in the Spoonacular format
 * TODO: Connect to front-end to receive query
*/
function getIngredientQuery(arr) {
    let result = '';

    let prefList = exportPrefs();   // List of user preference
    let prefIngredients = prefList['ingredients'];  // User preference ingredient
    let prefDiet = prefList['diet'];    // User preference diet

    if (!arr) return;
    else result = result + arr[0].toLowerCase();
    for (let i = 1; i < arr.length; i++) {
        result = result + "," + arr[i].toLowerCase();
    }

    prefIngredients.forEach(element => {
      result = result + "," + element.toLowerCase();
    });

    result = result + "," + prefDiet.toLowerCase();

    // Now the `result` should have a form of 'arr[0],arr[1], ... ,arr[n],prefIngredients,prefDiet'
    return result;
}

/*
 * Processes the initial JSON response from recipe search
 * Returns the recipe IDs for the second search
*/
function processInitialResult(arr) {
    let result = [];
    if (!arr) return [];
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i]['id']);
    }
    return result;
}

export { getIngredientQuery };
