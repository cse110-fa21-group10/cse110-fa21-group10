/* eslint eol-last: ["error", "never"] */


describe('Basic user flow for Website', () => {
  // Access the recipe manager site
  beforeAll(async () => {
    await page.goto('https://cse110-group10.web.app/');
  });

  
  it('Add ingredients to preferences', async () => {
    console.log('Adding recipes');
    
    const add_ingredient = await page.$('add-ingredient-box');
    const add_ingredient_button = await page.$('add-ingredient-button')
    add_ingredient.value = "broccoli";
    await add_ingredient_button.click();

    const local = window.localStorage;
    const prefs = JSON.parse(local.getItem('prefs'));
    const ingredientList = prefs['ingredients'];
    expect(ingredientList.indexOf(add_ingredient.value).value).toBeGreaterThanOrEqual(0);
  });
});