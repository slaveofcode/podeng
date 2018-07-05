'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    good: types.any({ serialize: { to: 'good_status' } })
  });

  expect(Obj1.serialize({ good: true })).toEqual({ good_status: true });
  expect(Obj1.deserialize({ good_status: 'Yes' })).toEqual({ good: 'Yes' });
  expect(Obj1.deserialize({})).toEqual({ good: null });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    good: types.any({
      serialize: { to: 'good_thing' },
      deserialize: { from: 'from_a_good_thing' }
    })
  });

  expect(Obj1.serialize({ good: 'meh' })).toEqual({ good_thing: 'meh' });
  expect(Obj1.serialize({ good: true })).toEqual({ good_thing: true });
  expect(Obj1.deserialize({ good_thing: 'meh' })).toEqual({ good: null });
  expect(Obj1.deserialize({ from_a_good_thing: 'meh' })).toEqual({
    good: 'meh'
  });
  expect(Obj1.deserialize({ from_a_good_thing: true })).toEqual({ good: true });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    good: types.any({
      serialize: { to: 'good_thing' }
    }),
    best: types.any({ serialize: { display: false } })
  });

  expect(Obj1.serialize({ good: 'Foo-Bar', best: 'foo' })).toEqual({
    good_thing: 'Foo-Bar'
  });
  expect(Obj1.serialize({ good: true, best: 'bar' })).toEqual({
    good_thing: true
  });
  expect(Obj1({ good: 123, best: 'foo' })).toEqual({
    good: 123,
    best: 'foo'
  });
});
