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
})
