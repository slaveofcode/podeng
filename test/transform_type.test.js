'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use transform type', () => {
  const Obj = blueprint.object({
    val1: types.transform(val => '12345'),
  })

  const Obj2 = blueprint.object({
    val1: types.transform(4737),
  })

  const throwError = () => {
    blueprint.object({
      value: types.transform,
    })({ value: 'xx' })
  }

  expect(Obj({ val1: 'xyz' })).toEqual({
    val1: '12345',
  })

  expect(Obj2({ val1: 35 })).toEqual({
    val1: 4737,
  })

  expect(throwError).toThrow(TypeError('Invalid setup for "transform" type'))
});

test('Should be able to access sibling parameters', () => {
  const Obj = blueprint.object({
    val: types.string({ serialize: { to: 'value' } }),
    val1: types.transform((val, info) => {
      const value = info.operationType === 'deserialize' ? info.data.value : info.data.val;
      return value + '12345'
    }),
  });

  expect(Obj({ val: 'foo', val1: 'xyz' })).toEqual({
    val: 'foo',
    val1: 'foo12345',
  })

  expect(Obj.serialize({ val: 'foo', val1: 'xyz' })).toEqual({
    value: 'foo',
    val1: 'foo12345',
  })

  expect(Obj.deserialize({ value: 'foo', val1: 'xyz' })).toEqual({
    val: 'foo',
    val1: 'foo12345',
  })
})