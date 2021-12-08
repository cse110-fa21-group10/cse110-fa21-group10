import { exportPrefs } from './FrontPage.js';

const baseURL = 'https://api.spoonacular.com/recipes/';

/*
 * Runs a query using `ingredientList` and returns the JSON for first
 * result from Spoonacular Complex Search
 */
async function runQuery(ingredientList, numResults) {
    let initialData = [];
    // WARNING: Racks up daily uses of API key FAST
    const numToFetch = numResults;    // TODO: maybe move this somewhere else or change to a diff #
    const prefList = exportPrefs();   // List of user preference
    const key = prefList['key'];
    if (!key) {
        return undefined;
    }

    const queryStr = getIngredientQuery(ingredientList, prefList);
    let initialQueryStr = `${baseURL}complexSearch${queryStr}&number=${numToFetch}`;
    let fetchStatus = await fetchJSON(initialQueryStr, initialData).catch(() => {
        console.log("Recipes were not fetched successfully from ingredients");
        return 'fetch-failure';
    });
    if (fetchStatus === 'fetch-failure') {
        return fetchStatus;
    }
    initialData = initialData[0]['results'];
    let JSONquery = processInitialResult(initialData);

    const JSONresult = [];
    if (!JSONquery.length) {
        return 'no-results';
    }
    let recipeQuery = '';
    for (let i = 0; i < JSONquery.length; i++) {
        recipeQuery = `${baseURL}${JSONquery[i]}/information?apiKey=${key}`;
        fetchStatus = await fetchJSON(recipeQuery, JSONresult).catch(() => {
            console.log("Full JSONs not fetched successfully");
            return 'fetch-failure';
        });
        if (fetchStatus == 'fetch-failure') {
            return fetchStatus;
        }
    }
    shuffle(JSONresult); // for adding some randomness to queries
    return JSONresult;   //return a list of queries
}

// async function runQuery(ingredientList) {
//     let initialData = [];
//     const numToFetch = '1'; // TODO: maybe move this somewhere else or change to a diff #
//     const prefList = exportPrefs();   // List of user preference
//     const key = prefList['key'];
//     if (!key) {
//         return undefined;
//     }

//     const queryStr = getIngredientQuery(ingredientList, prefList);
//     let initialQueryStr = `${baseURL}complexSearch${queryStr}&number=${numToFetch}`;
//     let fetchStatus = await fetchJSON(initialQueryStr, initialData).catch(() => {
//         console.log("Recipes were not fetched successfully from ingredients");
//         return 'fetch-failure';
//     });
//     if (fetchStatus === 'fetch-failure') {
//         return fetchStatus;
//     }
//     initialData = initialData[0]['results'];
//     let JSONquery = processInitialResult(initialData);

//     const JSONresult = [];
//     if (!JSONquery.length) {
//         return 'no-results';
//     }
//     let recipeQuery = '';
//     for (let i = 0; i < JSONquery.length; i++) {
//         recipeQuery = `${baseURL}${JSONquery[i]}/information?apiKey=${key}`;
//         fetchStatus = await fetchJSON(recipeQuery, JSONresult).catch(() => {
//             console.log("Full JSONs not fetched successfully");
//             return 'fetch-failure';
//         });
//         if (fetchStatus == 'fetch-failure') {
//             return fetchStatus;
//         }
//     }
//     return JSONresult[0]; // For now, only return the first result
// }


/*
 * Short helper function for randomizing queries.
 * Runs an in-place shuffle over the input array.
 */

function shuffle(arr) {
    let l = arr.length;
    for (let i = 0; i < l; ++i) {
        let idx = parseInt(Math.random() * l);
        let temp = arr[i];
        arr[i] = arr[idx];
        arr[idx] = temp;
    }
}

/*
 * Async function based on Lab 6
 * Parses JSON into an array from URL
 * TODO: Make error messages more verbose
 */
async function fetchJSON(URL, arr) {
    // console.log(`fetching:${URL}`);
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
    let prefDiet = prefList['diet'].toLowerCase();    // User preference diet

    let result = '';

    // combine arr with prefs 
    arr.forEach(e => {
        let idx = prefIngredients.indexOf(e);
        if (idx === -1) {
            prefIngredients.push(e);
        }
    });
    console.log(prefIngredients);
    if (!prefIngredients.length) return;
    else result = result + '&includeIngredients=' + prefIngredients[0].toLowerCase();
    for (let i = 1; i < prefIngredients.length; i++) {
        result = result + "," + prefIngredients[i].toLowerCase();
    }
    console.log(result);
    if (prefDiet !== 'none') {
        result = result + "&diet=" + prefDiet;
    }

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