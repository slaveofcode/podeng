'use strict';

/* eslint-disable */

const moment = require('moment-timezone')
const blueprint = require('../blueprint')
const types = require('../types')

moment.tz.setDefault('Asia/Jakarta')

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

  const Obj5 = blueprint.object({
    val1: types.datetime({ dateOnly: 'DD-MM-YYYY' }),
    val2: types.datetime({ timeOnly: 'H:m:s' }),
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
    val1: '2018-06-18T00:00:00+07:00',
    val2: '1991-06-18T00:00:00+07:00',
  })

  expect(Obj2({ val1: '18-06-1991', val2: '2018-06-18' })).toEqual({
    val1: '1991-06-18T00:00:00+07:00',
    val2: '18-06-2018',
  })

  const obj3Inst = Obj3({ val1: '1991-06-18', val2: '2018-06-18' })

  expect(obj3Inst.val1).toEqual('1991-06-18T00:00:00Z')
  expect(obj3Inst.val2).toBeInstanceOf(moment)

  expect(Obj4({ val1: '1991-06-18', val2: '2018-06-18 18:18:18' })).toEqual({
    val1: '1991-06-18',
    val2: '18:18:18',
  })

  expect(Obj5({ val1: '1991-06-18', val2: '2018-06-18 09:30:05' })).toEqual({
    val1: '18-06-1991',
    val2: '9:30:5',
  })

  expect(throwError).toThrow(TypeError('Invalid setup for "date" type'))
})

test('Ignore null value', () => {
  const Obj = blueprint.object({
    value: types.datetime,
  })

  expect(Obj({ value: null })).toEqual({ value: null })
})