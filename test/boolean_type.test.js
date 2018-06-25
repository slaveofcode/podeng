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

  const Obj3 = blueprint.object({
    val1: types.bool,
    val2: types.bool(['Yes', 'Yeah'], { trueExceptNil: true }),
    val3: types.bool({ trueExceptNil: true }),
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

  expect(Obj3({ val1: 'not nil', val2: 'Yes', val3: 'not nil' })).toEqual({
    val1: false,
    val2: true,
    val3: true,
  })

  expect(Obj3({ val1: true, val2: 'Yeah', val3: 123 })).toEqual({
    val1: true,
    val2: true,
    val3: true,
  })

  expect(Obj3({ val1: false, val2: 'foo', val3: null })).toEqual({
    val1: false,
    val2: false,
    val3: false,
  })

  expect(Obj3({ val1: true, val2: 'bar' })).toEqual({
    val1: true,
    val2: false,
    val3: false,
  })

  expect(throwError).toThrow(TypeError('Invalid setup for "bool" type'))
})
