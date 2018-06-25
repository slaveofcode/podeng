'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    good: types.bool({ serialize: { to: 'good_status' } })
  });

  expect(Obj1.serialize({ good: true })).toEqual({ good_status: true });
  expect(Obj1.deserialize({ good_status: '20' })).toEqual({ good: false });
  expect(Obj1.deserialize({ good_status: false })).toEqual({ good: false });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    good: types.bool({
      serialize: { to: 'good_thing' },
      deserialize: { from: 'from_a_good_thing' }
    })
  });

  const Obj2 = blueprint.object({
    good: types.bool({
      validList: ['Yes', 'Sure'],
      serialize: { to: 'best' }
    })
  });

  const Obj3 = blueprint.object({
    good: types.bool({
      validList: ['Yes', 'Sure'],
      serialize: { to: 'best' },
      caseSensitive: false
    })
  });

  expect(Obj1.serialize({ good: 'meh' })).toEqual({ good_thing: false });
  expect(Obj1.serialize({ good: true })).toEqual({ good_thing: true });
  expect(Obj1.deserialize({ good_thing: 'meh' })).toEqual({ good: false });
  expect(Obj1.deserialize({ from_a_good_thing: 'meh' })).toEqual({
    good: false
  });
  expect(Obj1.deserialize({ from_a_good_thing: true })).toEqual({ good: true });

  expect(Obj2.serialize({ good: 'Yes' })).toEqual({ best: true });
  expect(Obj2.serialize({ good: 'Yeah' })).toEqual({ best: false });
  expect(Obj2.serialize({ good: 'yes' })).toEqual({ best: false });

  expect(Obj2.deserialize({ best: 'Yes' })).toEqual({ good: true });
  expect(Obj2.deserialize({ best: 'Yeah' })).toEqual({ good: false });
  expect(Obj2.deserialize({ best: 'yes' })).toEqual({ good: false });

  expect(Obj3.serialize({ good: true })).toEqual({ best: true });
  expect(Obj3.serialize({ good: 'yes' })).toEqual({ best: true });
  expect(Obj3.serialize({ good: 'Yes' })).toEqual({ best: true });

  expect(Obj3.deserialize({ best: true })).toEqual({ good: true });
  expect(Obj3.deserialize({ best: 'yes' })).toEqual({ good: true });
  expect(Obj3.deserialize({ best: 'Yes' })).toEqual({ good: true });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    good: types.bool({
      serialize: { to: 'good_thing' },
      trueExceptNil: true
    }),
    best: types.bool({ serialize: { display: false } })
  });

  expect(Obj1.serialize({ good: 'true', best: 'foo' })).toEqual({
    good_thing: true
  });
  expect(Obj1.serialize({ good: true, best: 'bar' })).toEqual({
    good_thing: true
  });
  expect(Obj1({ good: 123, best: 'foo' })).toEqual({
    good: true,
    best: false
  });
});
