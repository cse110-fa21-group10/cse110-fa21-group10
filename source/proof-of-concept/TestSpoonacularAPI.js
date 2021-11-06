window.addEventListener('DOMContentLoaded', init);

// TODO: replace with different key when expired
// WARNING: each key only has 150 points per day, right now each rerun
//          of this script costs about 2.5 points, so don't save and rerun
//          too many times (or make a new account for a new key)
const key = '';

// Change these to get different results in the query & console log output
const initialQueryTerm = 'nachos';
const includeIngredients = 'rice';

const baseURI = 'https://api.spoonacular.com/recipes';
const initialQueryURI = `${baseURI}/complexSearch`;
const initialQueryStr = `${initialQueryURI}?apiKey=${key}&query=${initialQueryTerm}`
                        + `&includeIngredients=${includeIngredients}`;
const data = [];

async function init() {
  // fetch a list of possible matches
  let fetchSuccessful = await fetchQuery(processInitialQuery, initialQueryStr)
      .catch(fetchSuccess => {
    if (!fetchSuccess) {
      console.log('Query fetch unsuccessful');
      return;
    }
  });
  console.log(`Fetching a list of results for ${initialQueryTerm} with ${includeIngredients}:`);
  console.log(data);

  //take the first result and search for its full recipe
  if (data.length) {
    const recipeID = data[0]['id'];
    const recipeQuery = `${baseURI}/${recipeID}/information?apiKey=${key}`;

    console.log(`Recipe data for ${data[0]['title']}`);
    fetchSuccessful = await fetchQuery(console.log, recipeQuery)
        .catch(fetchSuccess => {
      if (!fetchSuccess) {
        console.log('Recipe fetch unsuccessful');
        return;
      }
    });
  } else {
    console.log(`No recipes found for query: ${initialQueryTerm} with ${includeIngredients}`);
  } 
}

/*
 * Helper function that queries with queryStr and processes the result with process()
 */
async function fetchQuery(process, queryStr) {
  return new Promise((resolve, reject) => {

    fetch(queryStr)
      .then(response => response.json())
      .then(_data => {
        process(_data);
      })
      .then(() => {resolve(true)})
      .catch(() => {
        console.log(`ERR: Fetching ${queryStr} unsuccessful.`);
        reject(false);
      });

  });
}

/*
 * Small helper function for separating and saving the initial query's results
 */
const processInitialQuery = _data => {
  const results = _data['results'];
  for (let i = 0; i < results.length; i++) {
    data.push(results[i]);
  }
}
