'use strict';
const blueprint = require('../blueprint');
const types = require('../types');

test('Create an instace of blueprint object', () => {
  const Car = blueprint.object({
    type: types.string,
  });

  expect(typeof Car).toEqual('function');
});
