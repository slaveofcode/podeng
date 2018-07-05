'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use any type', () => {
  const Obj = blueprint.object({
    val1: types.any,
    val2: types.any(),
  })

  const Obj2 = blueprint.object({
    val1: types.any({ allowUndefined: true }),
    val2: types.any(),
  })

  expect(Obj({ val1: true, val2: null })).toEqual({
    val1: true,
    val2: null,
  })

  expect(Obj({ val1: undefined, val2: 'Foo' })).toEqual({
    val1: null,
    val2: 'Foo',
  })

  let undef
  expect(Obj2({ val1: undef, val2: 'Bar' })).toEqual({
    val1: undefined,
    val2: 'Bar',
  })
})
