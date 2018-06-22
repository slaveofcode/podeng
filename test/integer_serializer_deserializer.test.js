'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    num: types.integer({ serialize: { to: 'number' } })
  });

  expect(Obj1.serialize({ num: '10' })).toEqual({ number: 10 });
  expect(Obj1.deserialize({ number: '20' })).toEqual({ num: 20 });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    num: types.integer({
      serialize: { to: 'number' },
      deserialize: { from: 'a_number' }
    })
  });

  const Obj2 = blueprint.object({
    num: types.integer({
      min: 100,
      serialize: { to: 'number' }
    })
  });

  expect(Obj1.serialize({ num: '20' })).toEqual({ number: 20 });
  expect(Obj1.deserialize({ a_number: '50.32' })).toEqual({ num: 50 });
  expect(Obj2.deserialize({ number: 200 })).toEqual({ num: 200 });
  expect(Obj2.deserialize({ number: 10 })).toEqual({ num: null });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    num: types.integer({
      serialize: { to: 'a_number' }
    }),
    num2: types.integer({ serialize: { display: false } })
  });

  expect(Obj1.serialize({ num: 30, num2: '100' })).toEqual({
    a_number: 30
  });
  expect(Obj1({ num: 30, num2: '100' })).toEqual({
    num: 30,
    num2: 100
  });
});
