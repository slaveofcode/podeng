'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use datetime type', () => {
  const Obj = blueprint.object({
    val1: types.datetime,
    val2: types.datetime('DD-MM-YYYY'),
  })

  const Obj2 = blueprint.object({
    val1: types.datetime({ parseFormat: 'DD-MM-YYYY' }),
    val2: types.datetime({ returnFormat: 'DD-MM-YYYY' }),
  })

  const Obj3 = blueprint.object({
    val1: types.datetime({ timezoneAware: false }),
    val2: types.datetime({ asMoment: true }),
  })

  const Obj4 = blueprint.object({
    val1: types.datetime({ dateOnly: true }),
    val2: types.datetime({ timeOnly: true }),
  })

  const throwError = () => {
    blueprint.object({
      value: types.datetime([]),
    })
  }

  expect(Obj({ val1: true, val2: 'Yes' })).toEqual({
    val1: null,
    val2: null,
  })

  expect(Obj({ val1: '2018-06-18', val2: '18-06-1991' })).toEqual({
    val1: '2018-06-18',
    val2: '2018-06-18',
  })

  expect(throwError).toThrow(TypeError('Invalid setup for "date" type'))
})
