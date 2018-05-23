'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize', () => {
  const Obj1 = blueprint.object({
    name: types.string({ serialize: { to: 'firstName' } })
  });

  expect(Obj1.serialize({ name: 'Aditya' })).toEqual({ firstName: 'Aditya' });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    name: types.string({
      normalize: ['trimmed', 'upper_first'],
      serialize: { to: 'firstName' }
    }),
    address: types.string({ serialize: { display: false } }),
    zipcode: types.string
  });

  expect(Obj1.serialize({ name: 'aditya', address: 'some address' })).toEqual({
    firstName: 'Aditya',
    zipcode: null
  });
});
