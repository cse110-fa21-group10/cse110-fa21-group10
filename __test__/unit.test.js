/**
 * @jest-environment jsdom
 */

import { getIngredientQuery, processInitialResult } from '../source/proof-of-concept/SpoonacularAPIWrapper.js';

// Testing getIngredientQuery
test('getIngredientQuery', () => {
    expect(getIngredientQuery([], {'ingredients': ["sugar"], 'diet': "primal", 'key': "000"}))
    .toBe("?apiKey=000&includeIngredients=sugar&diet=primal");
});

test('getIngredientQuery', () => {
    expect(getIngredientQuery([], {'ingredients': ["apple", "blueberry"], 'diet': "vegan", 'key': "123"}))
    .toBe("?apiKey=123&includeIngredients=apple,blueberry&diet=vegan");
});

test('getIngredientQuery', () => {
    expect(getIngredientQuery([], {'ingredients': ["apple", "egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
    .toBe("?apiKey=000&includeIngredients=apple,egg,oil&diet=vegetarian");
});

// Testing processInitialResult
test('processInitialResult', () => {
    expect(processInitialResult([]))
    .toStrictEqual([]);
});

test('processInitialResult', () => {
    expect(processInitialResult([{"id": "123456"}, {"id": "654321"}]))
    .toStrictEqual(["123456", "654321"]);
});

test('processInitialResult', () => {
    expect(processInitialResult([{"id": "123456"}, {"id": "654321"}, {"id": "654123"}]))
    .toStrictEqual(["123456", "654321", "654123"]);
});