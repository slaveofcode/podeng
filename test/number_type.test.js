'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')

test('Object include number type', () => {
  const Obj = blueprint.object({
    num: types.number,
  })

  expect(typeof Obj).toEqual('function')
})

test('Validate value on wrong type passed', () => {
  const Obj = blueprint.object({
    num: types.number({ hideOnFail: true }),
    num2: types.number,
  })

  const Obj2 = blueprint.object({
    num: types.number({ min: 5.5 }),
  })

  const Obj3 = blueprint.object({
    num: types.number({ max: 100.050 }),
  })

  const Obj4 = blueprint.object({
    num: types.number({ min: 5.045, max: 17.5, default: 18.3 }),
  })

  const Obj5 = blueprint.object({
    number: types.number({
      minDigits: 2,
      maxDigits: 3,
    }),
  })

  expect(Obj({ num: {}, num2: '30.059' })).toEqual({ num2: 30.059 })
  expect(Obj2({ num: 20 })).toEqual({ num: 20 })
  expect(Obj2({ num: 'invalid' })).toEqual({ num: null })
  expect(Obj3({ num: 0 })).toEqual({ num: 0 })
  expect(Obj3({ num: '80.23' })).toEqual({ num: 80.23 })
  expect(Obj3({ num: '180.23' })).toEqual({ num: null })
  expect(Obj3({ num: '10.3235' })).toEqual({ num: 10.3235 })
  expect(Obj4({ num: '5.045' })).toEqual({ num: 5.045 })
  expect(Obj4({ num: '17.5' })).toEqual({ num: 17.5 })
  expect(Obj4({ num: {} })).toEqual({ num: 18.3 })
  expect(Obj4({ num: 5 })).toEqual({ num: 18.3 })
  expect(Obj4({ num: 20 })).toEqual({ num: 18.3 })
  expect(Obj5({ number: '27' })).toEqual({ number: 27 })
  expect(Obj5({ number: '9' })).toEqual({ number: null })
  expect(Obj5({ number: '9.5' })).toEqual({ number: null })
  expect(Obj5({ number: '1000' })).toEqual({ number: null })
  expect(Obj5({ number: '100.04' })).toEqual({ number: 100.04 })
})

test('Object array with number options', () => {
  const Obj = blueprint.object({
    value1: types.number,
    value2: types.number({ min: 10.18 }),
  })

  const Collections = blueprint.array(Obj)

  expect(
    Collections([
      { value1: 33.2, value2: '33' },
      { value1: '10.19', value2: 10.19 },
      { value1: 11, value2: 5 },
      { value1: '4.12', value2: '8.18' },
    ])
  ).toEqual([
    {
      value1: 33.2,
      value2: 33,
    },
    { value1: 10.19, value2: 10.19 },
    { value1: 11, value2: null },
    { value1: 4.12, value2: null },
  ])
})

test('Object include number with validation', () => {
  const Obj1 = blueprint.object(
    {
      value: types.number,
    },
    { throwOnError: true }
  )

  const Obj2 = blueprint.object(
    {
      value: types.number,
    },
    { throwOnError: new TypeError('The Value Error') }
  )

  const Obj3 = blueprint.object(
    {
      value: types.number,
    },
    { onError: TypeError('The Invalid onError value') }
  )

  const Obj4 = blueprint.object(
    {
      value: types.number,
    },
    {
      onError: {
        onKey: (key, err) => {
          throw new TypeError('Error coming from onKey')
        },
      },
    }
  )

  const Obj5 = blueprint.object(
    {
      value: types.number,
    },
    {
      onError: {
        onAll: errors => {
          throw new TypeError('Error coming from onAll')
        },
      },
    }
  )

  const Obj6 = blueprint.object({
    someKey: types.number({ min: 'abc' }),
  })
  const Obj7 = blueprint.object({
    someKey: types.number({ max: 'abc' }),
  })
  const Obj8 = blueprint.object({
    someKey: types.number({ minDigits: 'abc' }),
  })
  const Obj9 = blueprint.object({
    someKey: types.number({ maxDigits: 'abc' }),
  })

  const willThrow = obj => {
    return () => {
      obj.call(null, {
        value: function () { },
      })
    }
  }

  expect(willThrow(Obj1)).toThrow(PodengError)
  expect(willThrow(Obj2)).toThrow(TypeError)
  expect(willThrow(Obj3)).not.toThrow()
  expect(willThrow(Obj4)).toThrow(TypeError('Error coming from onKey'))
  expect(willThrow(Obj5)).toThrow(TypeError('Error coming from onAll'))
  expect(() => Obj6({ someKey: '123' })).toThrow(
    TypeError(
      'Number: Invalid "min" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => Obj7({ someKey: '123' })).toThrow(
    TypeError(
      'Number: Invalid "max" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => Obj8({ someKey: '123' })).toThrow(
    TypeError(
      'Number: Invalid "minDigits" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => Obj9({ someKey: '123' })).toThrow(
    TypeError(
      'Number: Invalid "maxDigits" option value for someKey, it should be in numeric type!'
    )
  )
})

test('Will validate using custom value', () => {
  const Obj = blueprint.object({
    value: types.number({
      validate: val => val > 100,
    }),
  })

  const Obj2 = blueprint.object({
    value: types.number({
      validate: val => val !== 1818,
      default: () => 9999,
    }),
  })

  expect(Obj({ value: '80.23' })).toEqual({ value: null })
  expect(Obj({ value: '220' })).toEqual({ value: 220 })
  expect(Obj2({ value: '123' })).toEqual({ value: 123 })
  expect(Obj2({ value: 1818 })).toEqual({ value: 9999 })
})


test('Ignore null value', () => {
  const Obj = blueprint.object({
    value: types.number,
  })

  expect(Obj({ value: null })).toEqual({ value: null })
})