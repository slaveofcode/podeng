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

test('Object include string with normalize options', () => {
  const ObjString = blueprint.object({
    value1: types.string({ normalize: 'uppercased' }),
    value2: types.string({ normalize: 'lowercased' }),
  });

  expect(ObjString({ value1: 'Some Text', value2: 'Some Text' })).toEqual({
    value1: 'SOME TEXT',
    value2: 'some text',
  });
});
