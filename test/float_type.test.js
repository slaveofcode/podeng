'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')

test('Object include float type', () => {
  const Obj = blueprint.object({
    num: types.float,
  })

  expect(typeof Obj).toEqual('function')
})

test('Validate value on wrong type passed', () => {
  const Obj = blueprint.object({
    num: types.float({ hideOnFail: true }),
    num2: types.float,
  })

  const Obj2 = blueprint.object({
    num: types.float({ min: 5.5 }),
  })

  const Obj3 = blueprint.object({
    num: types.float({ max: 100.050 }),
  })

  const Obj4 = blueprint.object({
    num: types.float({ min: 5.045, max: 17.5, default: 18.3 }),
  })

  const Obj5 = blueprint.object({
    number: types.float({
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

// test('Object array with integer options', () => {
//   const ObjInteger = blueprint.object({
//     value1: types.integer,
//     value2: types.integer({ min: 200 }),
//   })

//   const Collections = blueprint.array(ObjInteger)

//   expect(
//     Collections([
//       { value1: 123, value2: 123 },
//       { value1: 456, value2: 456 },
//       { value1: '789.12', value2: '789' },
//     ])
//   ).toEqual([
//     {
//       value1: 123,
//       value2: null,
//     },
//     { value1: 456, value2: 456 },
//     { value1: 789, value2: 789 },
//   ])
// })

// test('Object include integer with validation', () => {
//   const ObjInteger1 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     { throwOnError: true }
//   )

//   const ObjInteger2 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     { throwOnError: new TypeError('The Value Error') }
//   )

//   const ObjInteger3 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     { onError: TypeError('The Invalid onError value') }
//   )

//   const ObjInteger4 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     {
//       onError: {
//         onKey: (key, err) => {
//           throw new TypeError('Error coming from onKey')
//         },
//       },
//     }
//   )

//   const ObjInteger5 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     {
//       onError: {
//         onAll: errors => {
//           throw new TypeError('Error coming from onAll')
//         },
//       },
//     }
//   )

//   const ObjInteger6 = blueprint.object({
//     someKey: types.integer({ min: 'abc' }),
//   })
//   const ObjInteger7 = blueprint.object({
//     someKey: types.integer({ max: 'abc' }),
//   })
//   const ObjInteger8 = blueprint.object({
//     someKey: types.integer({ minDigits: 'abc' }),
//   })
//   const ObjInteger9 = blueprint.object({
//     someKey: types.integer({ maxDigits: 'abc' }),
//   })

//   const willThrow = obj => {
//     return () => {
//       obj.call(null, {
//         value: function() {},
//       })
//     }
//   }

//   expect(willThrow(ObjInteger1)).toThrow(PodengError)
//   expect(willThrow(ObjInteger2)).toThrow(TypeError)
//   expect(willThrow(ObjInteger3)).not.toThrow()
//   expect(willThrow(ObjInteger4)).toThrow(TypeError('Error coming from onKey'))
//   expect(willThrow(ObjInteger5)).toThrow(TypeError('Error coming from onAll'))
//   expect(() => ObjInteger6({ someKey: '123' })).toThrow(
//     TypeError(
//       'Integer: Invalid "min" option value for someKey, it should be in numeric type!'
//     )
//   )
//   expect(() => ObjInteger7({ someKey: '123' })).toThrow(
//     TypeError(
//       'Integer: Invalid "max" option value for someKey, it should be in numeric type!'
//     )
//   )
//   expect(() => ObjInteger8({ someKey: '123' })).toThrow(
//     TypeError(
//       'Integer: Invalid "minDigits" option value for someKey, it should be in numeric type!'
//     )
//   )
//   expect(() => ObjInteger9({ someKey: '123' })).toThrow(
//     TypeError(
//       'Integer: Invalid "maxDigits" option value for someKey, it should be in numeric type!'
//     )
//   )
// })

// test('Will validate using custom value', () => {
//   const Obj = blueprint.object({
//     value: types.integer({
//       validate: val => val > 100,
//     }),
//   })

//   const Obj2 = blueprint.object({
//     value: types.integer({
//       validate: val => val !== 1818,
//       default: () => 9999,
//     }),
//   })

//   expect(Obj({ value: '50' })).toEqual({ value: null })
//   expect(Obj({ value: '110' })).toEqual({ value: 110 })
//   expect(Obj2({ value: '123' })).toEqual({ value: 123 })
//   expect(Obj2({ value: 1818 })).toEqual({ value: 9999 })
// })
