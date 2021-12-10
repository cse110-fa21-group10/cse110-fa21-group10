/* eslint eol-last: ["error", "never"] */
const puppeteer = require('puppeteer');
describe('Basic user flow for Website', () => {
  // Access the recipe manager site
  const width=1024, height=1600;
  beforeAll(async () => {
    await page.goto('https://cse110-group10.web.app/');
  });
  
  it('Add ingredients to preferences', async () => {
    console.log('Adding ingredients');
    await page.setViewport({ width, height});
    //Add ingredients from the 'ingredient_add' array and then click the 'add ingredient button'
    const ingredient_add = ['broccoli', 'mushroom', 'beef', 'salt'];
    for (let i = 0; i < ingredient_add.length; ++i){
      await page.$eval('#add-ingredient-box', (el, ingredient) => {el.value = ingredient}, ingredient_add[i]);
      await page.click('button.add-ingredient-button');
      await new Promise((r) => setTimeout(r, 200));
    }

    //Obtain the local preferences json file
    const local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Check to make sure that all the ingredients we added are in the json file
    for (let i = 0; i < ingredient_add.length; ++i){
      expect(local.indexOf(ingredient_add[i])).toBeGreaterThanOrEqual(0);
    }

  });

  it('Remove ingredients from preferences', async () => {
    console.log('Removing ingredients');

    //Get the saved user preferences
    let local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Make sure salt is there from the previous test
    expect(local.indexOf('salt')).toBeGreaterThanOrEqual(0);

    //Remove salt
    await page.click('#_prefs-ingredient-salt-remove');

    //Update user preference
    local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Make sure salt is not in user preference
    expect(local.indexOf('salt')).toBeLessThan(0);
  });

  jest.setTimeout(35000);
  it('Query Testing', async () => {
    console.log('Querying recipe');

    //Add ingredients from the 'ingredient_add' array and then click the 'add ingredient button'
    const ingredient_add = ['broccoli', 'mushroom', 'beef', 'salt'];

    //Add salt back into the preference
    await page.$eval('#add-ingredient-box', el => el.value = 'salt');
    await page.click('button.add-ingredient-button');
    await new Promise((r) => setTimeout(r, 200));

    //Get the preference list
    let local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Check to make sure that all the ingredients we added are in the json file
    for (let i = 0; i < ingredient_add.length; ++i){
      expect(local.indexOf(ingredient_add[i])).toBeGreaterThanOrEqual(0);
    }

    //Search for a recipe
    await Promise.all([
      page.click('button.search-button'),
      page.waitForNavigation(),
    ]);

    //Check to make sure url paged to recipe page
    await new Promise((r) => setTimeout(r, 3000));
    expect(page.url()).toBe('https://cse110-group10.web.app/recipe-page.html?s=-1');
  });

  it('Test Query Validity', async () => {
    console.log('Testing recipe query');

    //Initalize what we had from previous tests
    const ingredient_add = ['broccoli', 'mushroom', 'beef', 'salt'];
    const ingredient_check = [];
    
    //Set all ingredients seen as false
    for (let i = 0; i < ingredient_add.length; i++){
      ingredient_check[i] = false;
    }

    //Check all the ingredients listed
    const ingredients = await page.evaluate(() => {
      let elements = Array.from(document.querySelectorAll('ul li'));
      let text = elements.map(element => {
        return element.innerHTML;
      })
      return text;
    });

    //Check to make sure all the ingredients listed on the recipe page is what we included
    for (let i = 0; i < ingredients.length; i++){
      for (let j = 0; j < ingredient_add.length; j++){
        if (ingredients[i].includes(ingredient_add[j])){
          ingredient_check[j] = true; 
        }
      }
    }
    for (let i = 0; i < ingredient_check; i++){
      expect(ingredient_check[i]).toBe(true);
    }

    //Go back to the previous back for next test
    await page.goBack();
    await new Promise((r) => setTimeout(r, 3000));
  });

  it('Test User Preference Storage', async () => {
    console.log('Testing User Preference Storage');

    //Reload the page for the test
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    //Initalize what we had from previous tests
    const ingredient_add = ['broccoli', 'mushroom', 'beef', 'salt'];
    
    //Get user preference from local storage
    const local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Check to make sure that all the ingredients we added before are still there
    //Which validates that user preferences does get saved
    for (let i = 0; i < ingredient_add.length; ++i){
      expect(local.indexOf(ingredient_add[i])).toBeGreaterThanOrEqual(0);
    }

  });

  it('Test User Preference Storage and local search', async () => {
    console.log('Testing User Preference Storage and local search');

    //Reload the page for the test
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    //Initalize what we had from previous tests
    const ingredient_add = ['broccoli', 'beef', 'salt'];
    const ingredient_searched = ['broccoli', 'beef', 'salt', 'eggplant'];
    const ingredient_check = [];

    //Set all ingredients seen as false
    for (let i = 0; i < ingredient_searched.length; i++){
      ingredient_check[i] = false;
    }
    
    //Remove mushrooms
    await page.click('#_prefs-ingredient-mushroom-remove');

    //Get user preference from local storage
    let local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });

    //Check to make sure that all the ingredients we added before are still there
    //Which validates that user preferences does get saved
    for (let i = 0; i < ingredient_add.length; ++i){
      expect(local.indexOf(ingredient_add[i])).toBeGreaterThanOrEqual(0);
    }
    //Make sure mushrooms are gone
    expect(local.indexOf('mushroom')).toBeLessThan(0);
    
    //Add eggplant to the non-saved ingredients
    await page.$eval('#search-box', el => el.value = 'eggplant');

    //Search for a recipe
    await Promise.all([
      page.click('button.search-button'),
      page.waitForNavigation(),
    ]);

    //Check to make sure url paged to recipe page
    await new Promise((r) => setTimeout(r, 3000));
    expect(page.url()).toBe('https://cse110-group10.web.app/recipe-page.html?s=-1');

    //Save recipe name of first recipe
    let first_title = await page.$('h1.title');

    //Check all the ingredients listed
    const ingredients = await page.evaluate(() => {
      let elements = Array.from(document.querySelectorAll('ul li'));
      let text = elements.map(element => {
        return element.innerHTML;
      })
      return text;
    });

    //Check to make sure all the ingredients listed on the recipe page is what we included
    //(Also includes eggplant)
    for (let i = 0; i < ingredients.length; i++){
      for (let j = 0; j < ingredient_searched.length; j++){
        if (ingredients[i].includes(ingredient_searched[j])){
          ingredient_check[j] = true; 
        }
      }
    }
    for (let i = 0; i < ingredient_check; i++){
      expect(ingredient_check[i]).toBe(true);
    }

    //reinitalize the ingredient check array
    for (let i = 0; i < ingredient_searched.length; i++){
      ingredient_check[i] = false;
    }

    //Go back to the previous back for next test
    await page.goBack();
    await new Promise((r) => setTimeout(r, 3000));

    //Reload the page for the test
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    

    //Search for recipe again
    await Promise.all([
      page.click('button.search-button'),
      page.waitForNavigation(),
    ]);

    //Check to make sure url paged to recipe page
    await new Promise((r) => setTimeout(r, 3000));
    expect(page.url()).toBe('https://cse110-group10.web.app/recipe-page.html?s=-1');

    //Save recipe name of first recipe
    let second_title = await page.$('h1.title');

    //Check to make sure all the ingredients in user preference are in there
    for (let i = 0; i < ingredients.length; i++){
      for (let j = 0; j < ingredient_check.length; j++){
        if (ingredients[i].includes(ingredient_add[j])){
          ingredient_check[j] = true; 
        }
      }
    }
    //everything except the last ingredient (eggplant) should be true
    for (let i = 0; i < ingredient_check - 1; i++){
      expect(ingredient_check[i]).toBe(true);
    }
    //We expect eggplant to be false
    expect(ingredient_check[ingredient_check.length - 1]).toBe(false);

    //First recipe is different from the second one
    console.log(first_title);
    console.log(second_title);
    expect(first_title).not.toEqual(second_title);
  });
});