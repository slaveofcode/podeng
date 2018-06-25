'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    val: types.transform(v => v + 18, {
      serialize: { to: 'transformed_value' }
    })
  });

  expect(Obj1.serialize({ val: 10 })).toEqual({ transformed_value: 28 });
  expect(Obj1.deserialize({ transformed_value: 2 })).toEqual({ val: 20 });
  expect(Obj1.deserialize({ transformed_value: '100' })).toEqual({
    val: '10018'
  });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    val: types.transform('foo-bar', {
      serialize: { to: 'transformed' },
      deserialize: { from: 'from_transformed' }
    })
  });

  const Obj2 = blueprint.object({
    val: types.transform(false)
  });

  expect(Obj1.serialize({ val: 'meh' })).toEqual({ transformed: 'foo-bar' });
  expect(Obj1.deserialize({ transformed: 'meh' })).toEqual({ val: 'foo-bar' });
  expect(Obj1.deserialize({})).toEqual({
    val: 'foo-bar'
  });
  expect(Obj1.deserialize()).toEqual({
    val: 'foo-bar'
  });

  expect(Obj2.serialize({ val: 'meh' })).toEqual({ val: false });
  expect(Obj2.deserialize({ val: 'meh' })).toEqual({ val: false });
  expect(Obj2.deserialize({})).toEqual({
    val: false
  });
  expect(Obj2.deserialize()).toEqual({
    val: false
  });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    higherThanThousand: types.transform(num => num > 1000, {
      serialize: { to: 'morethan_hundred' }
    }),
    hideOnLessThousand: types.transform(num => num < 1000, {
      serialize: { display: false }
    })
  });

  expect(
    Obj1.serialize({ higherThanThousand: 10, hideOnLessThousand: 99 })
  ).toEqual({
    morethan_hundred: false
  });
  expect(
    Obj1.serialize({ higherThanThousand: 1001, hideOnLessThousand: 10000 })
  ).toEqual({
    morethan_hundred: true
  });
  expect(Obj1({ higherThanThousand: 123, hideOnLessThousand: 900 })).toEqual({
    higherThanThousand: false,
    hideOnLessThousand: true
  });
});
