/* eslint eol-last: ["error", "never"] */
const puppeteer = require('puppeteer');
describe('Basic user flow for Website', () => {
  // Access the recipe manager site
  beforeAll(async () => {
    await page.goto('https://cse110-group10.web.app/');
  });
  
  it('Add ingredients to preferences', async () => {
    console.log('Adding ingredients');
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
    let local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });
    expect(local.indexOf('salt')).toBeGreaterThanOrEqual(0);
    await page.$eval('#remove-ingredient-box', el => el.value = 'salt');
    await page.click('button.remove-ingredient-button');
    local = await page.evaluate(() => {
      const prefs = JSON.parse(localStorage.getItem('prefs'));
      const ingredientList = prefs['ingredients'];
      return ingredientList;
    });
    expect(local.indexOf('salt')).toBeLessThan(0);
  });
  jest.setTimeout(10000);
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
    // //Add API Key
    await page.$eval('#add-api-key-box', el => el.value = 'edf4753b7dbf48c7ae6665777f8b8f11');
    await page.click('button.add-api-key-button');
    //Search for a recipe
    await Promise.all([
      page.click('button.search-button'),
      page.waitForNavigation(),
    ]);
    //await page.click('button.search-button');
    await new Promise((r) => setTimeout(r, 3000));
    expect(page.url()).toBe('https://cse110-group10.web.app/recipe-page.html');
  });
  it('Test Query Validity', async () => {
    console.log('Testing recipe query');
    //Add ingredients from the 'ingredient_add' array and then click the 'add ingredient button'
    const ingredient_add = ['broccoli', 'mushroom', 'beef', 'salt'];
    const ingredient_check = [];
    
    for (let i = 0; i < ingredient_add.length; i++){
      ingredient_check[i] = false;
    }
    const ingredients = await page.evaluate(() => {
      let elements = Array.from(document.querySelectorAll('ul li'));
      let text = elements.map(element => {
        return element.innerHTML;
      })
      return text;
    });
    // console.log(ingredients);
    // for (let i = 0; i < ingredients.length; i++){
    //   for (let j = 0; j < ingredient_add.length; j++){
    //     if (ingredients[i].includes(ingredient_add[j])){
    //       ingredient_check[j] = true; 
    //     }
    //   }
    // }
    // for (let i = 0; i < ingredient_check; i++){
    //   expect(ingredient_check[i]).toBe(true);
    // }
  });
});