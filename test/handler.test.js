'use strict';
const blueprint = require('../blueprint');
const types = require('../types');

test('Create an instace of blueprint object', () => {
  const Car = blueprint.object({
    type: types.string,
  });

  expect(typeof Car).toEqual('function');
});

test('Make sure blueprint object working with at least one type', () => {
  const Car = blueprint.object({
    type: types.string,
  });
  const Car2 = blueprint.object({
    type: types.string(),
  });

  expect(Car({ type: 'Honda' })).toEqual({ type: 'Honda' });
  expect(Car2({ type: 'Honda' })).toEqual({ type: 'Honda' });
});
