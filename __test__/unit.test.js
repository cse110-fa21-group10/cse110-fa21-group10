/**
 * @jest-environment jsdom
 */

const functions = require('../source/proof-of-concept/SpoonacularAPIWrapper.js');

test('getIngredientQuery', () => {
    expect(functions.getIngredientQuery([], {'ingredients': "apple", 'diet': "vegan", 'key': "123"}))
    .toBe("?apiKey=123&includeIngredients=apple&diet=vegan");
});

test('processInitialResult', () => {
    expect(functions.processInitialResult([{"id": "123456"}, {"id": "654321"}]))
    .toBe(["123456", "654321"]);
});