'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')

test('Object include integer type', () => {
  const Car = blueprint.object({
    year: types.integer,
  })

  expect(typeof Car).toEqual('function')
})

test('Validate value on wrong type passed', () => {
  const Car = blueprint.object({
    hp: types.integer({ hideOnFail: true }),
    year: types.integer,
  })

  const Person1 = blueprint.object({
    age: types.integer({ min: 1 }),
  })

  const Person2 = blueprint.object({
    age: types.integer({ max: 150 }),
  })

  const Kid = blueprint.object({
    age: types.integer({ min: 5, max: 17, default: 'adult or baby' }),
  })

  const Shoe = blueprint.object({
    number: types.integer({
      minDigits: 2,
      maxDigits: 3,
    }),
  })

  expect(Car({ hp: {}, year: '2014' })).toEqual({ year: 2014 })
  expect(Person1({ age: 20 })).toEqual({ age: 20 })
  expect(Person1({ age: 'invalid' })).toEqual({ age: null })
  expect(Person2({ age: 0 })).toEqual({ age: 0 })
  expect(Person2({ age: '150' })).toEqual({ age: 150 })
  expect(Person2({ age: '150.005' })).toEqual({ age: null })
  expect(Person2({ age: '140.3235' })).toEqual({ age: 140 })
  expect(Kid({ age: '7' })).toEqual({ age: 7 })
  expect(Kid({ age: 5 })).toEqual({ age: 5 })
  expect(Kid({ age: 20 })).toEqual({ age: 'adult or baby' })
  expect(Shoe({ number: '27' })).toEqual({ number: 27 })
  expect(Shoe({ number: '9' })).toEqual({ number: null })
})

test('Object array with integer options', () => {
  const ObjInteger = blueprint.object({
    value1: types.integer,
    value2: types.integer({ min: 200 }),
  })

  const Collections = blueprint.array(ObjInteger)

  expect(
    Collections([
      { value1: 123, value2: 123 },
      { value1: 456, value2: 456 },
      { value1: '789.12', value2: '789' },
    ])
  ).toEqual([
    {
      value1: 123,
      value2: null,
    },
    { value1: 456, value2: 456 },
    { value1: 789, value2: 789 },
  ])
})

test('Object include integer with validation', () => {
  const ObjInteger1 = blueprint.object(
    {
      value: types.integer,
    },
    { throwOnError: true }
  )

  const ObjInteger2 = blueprint.object(
    {
      value: types.integer,
    },
    { throwOnError: TypeError('The Value Error') }
  )

  const ObjInteger3 = blueprint.object(
    {
      value: types.integer,
    },
    { onError: TypeError('The Value Error') }
  )

  const ObjInteger4 = blueprint.object(
    {
      value: types.integer,
    },
    {
      onError: {
        onKey: (key, err) => {
          throw new TypeError('Error coming from onKey')
        },
      },
    }
  )

  const ObjInteger5 = blueprint.object(
    {
      value: types.integer,
    },
    {
      onError: {
        onAll: errors => {
          throw new TypeError('Error coming from onAll')
        },
      },
    }
  )

  const ObjInteger6 = blueprint.object({
    someKey: types.integer({ min: 'abc' }),
  })
  const ObjInteger7 = blueprint.object({
    someKey: types.integer({ max: 'abc' }),
  })
  const ObjInteger8 = blueprint.object({
    someKey: types.integer({ minDigits: 'abc' }),
  })
  const ObjInteger9 = blueprint.object({
    someKey: types.integer({ maxDigits: 'abc' }),
  })

  const willThrow = obj => {
    return () => {
      obj.call(null, {
        value: function() {},
      })
    }
  }

  expect(willThrow(ObjInteger1)).toThrow(PodengError)
  expect(willThrow(ObjInteger2)).toThrow(TypeError)
  expect(willThrow(ObjInteger3)).not.toThrow()
  expect(willThrow(ObjInteger4)).toThrow(TypeError('Error coming from onKey'))
  expect(willThrow(ObjInteger5)).toThrow(TypeError('Error coming from onAll'))
  expect(() => ObjInteger6({ someKey: '123' })).toThrow(
    TypeError(
      'Integer: Invalid "min" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => ObjInteger7({ someKey: '123' })).toThrow(
    TypeError(
      'Integer: Invalid "max" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => ObjInteger8({ someKey: '123' })).toThrow(
    TypeError(
      'Integer: Invalid "minDigits" option value for someKey, it should be in numeric type!'
    )
  )
  expect(() => ObjInteger9({ someKey: '123' })).toThrow(
    TypeError(
      'Integer: Invalid "maxDigits" option value for someKey, it should be in numeric type!'
    )
  )
})

test('Will validate using custom value', () => {
  const Obj = blueprint.object({
    value: types.integer({
      validate: val => val > 100,
    }),
  })

  const Obj2 = blueprint.object({
    value: types.integer({
      validate: val => val !== 1818,
      default: () => 9999,
    }),
  })

  expect(Obj({ value: '50' })).toEqual({ value: null })
  expect(Obj({ value: '110' })).toEqual({ value: 110 })
  expect(Obj2({ value: '123' })).toEqual({ value: 123 })
  expect(Obj2({ value: 1818 })).toEqual({ value: 9999 })
})
