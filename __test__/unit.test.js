/**
 * @jest-environment jsdom
 */

const functions = require('../source/proof-of-concept/SpoonacularAPIWrapper.js');

// Testing getIngredientQuery
test('getIngredientQuery', () => {
    expect(functions.getIngredientQuery([], {'ingredients': [], 'diet': "", 'key': ""}))
    .toBe("?apiKey=&includeIngredients=&diet=");
});

test('getIngredientQuery', () => {
    expect(functions.getIngredientQuery([], {'ingredients': ["apple"], 'diet': "vegan", 'key': "123"}))
    .toBe("?apiKey=123&includeIngredients=apple&diet=vegan");
});

test('getIngredientQuery', () => {
    expect(functions.getIngredientQuery([], {'ingredients': ["apple", "egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
    .toBe("?apiKey=000&includeIngredients=apple,egg,oil&diet=vegetarian");
});

// Testing processInitialResult
test('processInitialResult', () => {
    expect(functions.processInitialResult([]))
    .toStrictEqual([]);
});

test('processInitialResult', () => {
    expect(functions.processInitialResult([{"id": "123456"}, {"id": "654321"}]))
    .toStrictEqual(["123456", "654321"]);
});

test('processInitialResult', () => {
    expect(functions.processInitialResult([{"id": "123456"}, {"id": "654321"}, {"id": "654123"}]))
    .toStrictEqual(["123456", "654321", "654123"]);
});