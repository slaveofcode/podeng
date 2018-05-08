'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object include string type', () => {
  const Car = blueprint.object({
    type: types.string,
  });

  expect(typeof Car).toEqual('function');
});

test('Object include string type with json stringify', () => {
  const ObjStringify = blueprint.object({
    value: types.string,
  });

  const ObjNonStringify = blueprint.object({
    value: types.string({ stringify: false }),
  });

  expect(ObjStringify({ value: { age: 27 } })).toEqual({
    value: '{"age":27}',
  });
  expect(ObjNonStringify({ value: { age: 27 } })).toEqual({
    value: null,
  });
});
