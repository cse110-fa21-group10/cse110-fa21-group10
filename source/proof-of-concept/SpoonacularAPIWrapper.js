import { exportPrefs } from './FrontPage.js';

const baseURL = 'https://api.spoonacular.com/recipes/';

/*
 * Runs a query using `ingredientList` and returns the JSON for first
 * result from Spoonacular Complex Search
 */
async function runQuery(ingredientList) {
    const initialData = [];
    const numToFetch = '1'; // TODO: maybe move this somewhere else or change to a diff #
    const prefList = exportPrefs();   // List of user preference
    const key = prefList['key'];
    if (!key) {
        alert('ERROR: MISSING API KEY');
        return false;
    }

    const queryStr = getIngredientQuery(ingredientList, prefList);
    let initialQueryStr = `${baseURL}complexSearch${queryStr}&number=${numToFetch}`;
    let fetchSuccessful = await fetchJSON(initialQueryStr, initialData);
    if (!fetchSuccessful) {
        console.log("Recipes were not fetched successfully from ingredients");
        return false;
    }
    console.log(initialData);
    let JSONquery = processInitialResult(initialData);
    console.log(JSONquery);

    const JSONresult = [];
    if (!JSONquery.length) return false;
    let recipeQuery = '';
    for (let i = 0; i < JSONquery.length; i++) {
        recipeQuery = `${baseURL}${JSONquery[i]}/information?apiKey=${key}`;
        fetchSuccessful = await fetchJSON(recipeQuery, JSONresult);
        if (!fetchSuccessful) {
            console.log("Full JSONs not fetched successfully");
            return false;
        }
    }
    //console.log(JSONresult);
    //console.log("DONE!");
    return JSONresult
}

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
function getIngredientQuery(arr, prefList) {

    let key = prefList['key'];
    let prefIngredients = prefList['ingredients'];  // User preference ingredient
    let prefDiet = prefList['diet'];    // User preference diet

    let result = '';

    // TODO: check for empty arr, combine arr with prefs 
    if (!arr) return;
    else result = result + '&includeIngredients=' + arr[0].toLowerCase();
    for (let i = 1; i < arr.length; i++) {
        result = result + "," + arr[i].toLowerCase();
    }

    prefIngredients.forEach(element => {
      result = result + "," + element.toLowerCase();
    });

    result = result + "&diet=" + prefDiet.toLowerCase();

    if (key) {
        result = `?apiKey=${key}${result}`;
    } else {
        result = 'ERR';
    }

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

export { runQuery };
