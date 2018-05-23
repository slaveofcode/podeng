'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    name: types.string({ serialize: { to: 'firstName' } })
  });

  expect(Obj1.serialize({ name: 'Aditya' })).toEqual({ firstName: 'Aditya' });
  expect(Obj1.deserialize({ firstName: 'Aditya' })).toEqual({ name: 'Aditya' });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    name: types.string({
      serialize: { to: 'firstName' },
      deserialize: { from: 'username' }
    })
  });

  const Obj2 = blueprint.object({
    name: types.string({
      normalize: 'uppercased',
      serialize: { to: 'firstName' }
    })
  });

  expect(Obj1.serialize({ name: 'Aditya' })).toEqual({ firstName: 'Aditya' });
  expect(Obj1.deserialize({ username: 'Aditya' })).toEqual({ name: 'Aditya' });
  expect(Obj2.deserialize({ firstName: 'Aditya' })).toEqual({ name: 'ADITYA' });
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
