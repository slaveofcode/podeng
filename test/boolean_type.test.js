'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use boolean type', () => {
  const Obj = blueprint.object({
    val1: types.bool,
    val2: types.bool(['Yes', 'Yeah']),
  })

  const Obj2 = blueprint.object({
    val1: types.bool(['Yes', 'Yeah'], ['No', 'Not']),
    val2: types.bool({
      invalidList: ['No', 'Nope'],
      caseSensitive: false,
    }),
  })

  const throwError = () => {
    blueprint.object({
      value: types.bool([]),
    })
  }

  expect(Obj({ val1: true, val2: 'Yes' })).toEqual({
    val1: true,
    val2: true,
  })

  expect(Obj({ val1: false, val2: 'No' })).toEqual({
    val1: false,
    val2: false,
  })

  expect(Obj2({ val1: 'Yeah', val2: 'sure' })).toEqual({
    val1: true,
    val2: true,
  })

  //   expect(throwError).toThrow(TypeError('Invalid setup for "bool" type'))
})
