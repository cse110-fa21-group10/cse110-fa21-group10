const functions = require('../source/proof-of-concept/SpoonacularAPIWrapper.js');

test('processInitialResult', () => {
    expect(functions.processInitialResult([{"id": "123456"}, {"id": "654321"}])).toBe(["123456", "654321"]);
});