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
    const ingredient_add = ['broccoli', 'mushroom', 'pork', 'salt'];
    for (let i = 0; i < ingredient_add.length; ++i){
      console.log(ingredient_add[i]);
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
    
    await page.$eval('#add-ingredient-box', el => el.value = 'salt');
    await page.click('button.add-ingredient-button');
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
});