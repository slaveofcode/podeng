'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize', () => {
  const Obj1 = blueprint.object({
    name: types.string({ serialize: { to: 'firstName' } })
  });

  expect(Obj1({ name: 'Aditya' })).toEqual({ firstName: 'aditya' });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    name: types.string({ serialize: { to: 'firstName' } })
  });

  expect(Obj1.serialize({ name: 'Aditya' })).toEqual({ firstName: 'aditya' });
});
