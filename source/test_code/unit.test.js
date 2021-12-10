/**
 * @jest-environment jsdom
 */

 import { getIngredientQuery, processInitialResult } from '../SpoonacularAPIWrapper.js';

 // Testing getIngredientQuery
 // Note: this function **always** expects a nonempty key to be 
 // passed in; if it does not find such a key it will return `ERR`
 // unless there are no ingredients in which case it returns undefined

 // Test with all empty inputs
 test('getIngredientQuery', () => {
  expect(getIngredientQuery([], {'ingredients': [""], 'diet': "", 'key': ""}))
  .toBe("ERR");
});

// Test with only arr
test('getIngredientQuery', () => {
  expect(getIngredientQuery(["apple"], {'ingredients': [], 'diet': "", 'key': "0"}))
  .toBe("?apiKey=0&includeIngredients=apple&diet=");
});

// Test with only ingredient
test('getIngredientQuery', () => {
  expect(getIngredientQuery([], {'ingredients': ["peach"], 'diet': "", 'key': "0"}))
  .toBe("?apiKey=0&includeIngredients=peach&diet=");
});

// Test with only diet
test('getIngredientQuery', () => {
  expect(getIngredientQuery([], {'ingredients': [""], 'diet': "vegan", 'key': "0"}))
  .toBe("?apiKey=0&includeIngredients=&diet=vegan");
});

// Test with only key
 test('getIngredientQuery', () => {
     expect(getIngredientQuery([], {'ingredients': [""], 'diet': "", 'key': "000"}))
     .toBe("?apiKey=000&includeIngredients=&diet=");
 });
 
 // Test with empty arr, but has contents in prefList
 test('getIngredientQuery', () => {
     expect(getIngredientQuery([], {'ingredients': ["apple"], 'diet': "vegan", 'key': "123"}))
     .toBe("?apiKey=123&includeIngredients=apple&diet=vegan");
 });
 
 test('getIngredientQuery', () => {
     expect(getIngredientQuery([], {'ingredients': ["apple", "egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
     .toBe("?apiKey=000&includeIngredients=apple,egg,oil&diet=vegetarian");
 });
 
 // Test with combining arr and prefList['ingredients']
 test('getIngredientQuery', () => {
  expect(getIngredientQuery(["apple", "egg"], {'ingredients': ["apple", "egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
  .toBe("?apiKey=000&includeIngredients=apple,egg,oil&diet=vegetarian");
});

test('getIngredientQuery', () => {
  expect(getIngredientQuery(["butter", "egg", "salt"], {'ingredients': ["apple", "egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
  .toBe("?apiKey=000&includeIngredients=apple,egg,oil,butter,salt&diet=vegetarian");
});

test('getIngredientQuery', () => {
  expect(getIngredientQuery(["butter", "salt"], {'ingredients': ["egg", "oil"], 'diet': "vegetarian", 'key': "000"}))
  .toBe("?apiKey=000&includeIngredients=egg,oil,butter,salt&diet=vegetarian");
});


// Testing processInitialResult

// Test with empty list
 test('processInitialResult', () => {
     expect(processInitialResult([]))
     .toStrictEqual([]);
 });

// Test with empty string
 test('processInitialResult', () => {
  expect(processInitialResult([""]))
  .toStrictEqual([undefined]);
});
 
// Test with objects only containing 'id' key
 test('processInitialResult', () => {
     expect(processInitialResult([{"id": "123456"}, {"id": "654321"}]))
     .toStrictEqual(["123456", "654321"]);
 });
 
 test('processInitialResult', () => {
     expect(processInitialResult([{"id": "123456"}, {"id": "654321"}, {"id": "654123"}]))
     .toStrictEqual(["123456", "654321", "654123"]);
 });

 test('processInitialResult', () => {
  expect(processInitialResult([{"id": "123456"}, {"id": "654321"}, {"id": "654123"}, {"id": "135791"}, {"id": "246802"}]))
  .toStrictEqual(["123456", "654321", "654123", "135791", "246802"]);
});

 // Test with objects containing not only 'id' key
 test('processInitialResult', () => {
  expect(processInitialResult([{"id": "123456", "number": "000000"}, {"id": "654321"}]))
  .toStrictEqual(["123456", "654321"]);
});

test('processInitialResult', () => {
  expect(processInitialResult([{"id": "123456"}, {"id": "654321", "nubmer": "000000"}, {"id": "654123"}]))
  .toStrictEqual(["123456", "654321", "654123"]);
});

test('processInitialResult', () => {
  expect(processInitialResult([{"id": "123456", "number": "000000"}, {"id": "654321", "name": "000000"}, {"id": "654123", "result": "000000"}]))
  .toStrictEqual(["123456", "654321", "654123"]);
});