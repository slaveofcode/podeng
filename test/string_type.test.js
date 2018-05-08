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

  const DefaultValue = blueprint.object({
    value: types.string({ stringify: false, default: 'Empty' }),
  });

  const DefaultValueFunc = blueprint.object({
    value: types.string({ stringify: false, default: () => 'ValueFunc' }),
  });

  expect(ObjStringify({ value: { age: 27 } })).toEqual({
    value: '{"age":27}',
  });
  expect(ObjNonStringify({ value: {} })).toEqual({
    value: null,
  });
  expect(DefaultValue({ value: {} })).toEqual({
    value: 'Empty',
  });
  expect(DefaultValueFunc({ value: {} })).toEqual({
    value: 'ValueFunc',
  });
});
