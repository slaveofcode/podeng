'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')

test('Validate value on wrong type passed', () => {
  const Car = blueprint.object({
    brand: types.options(['Honda', 'Toyota', 'Mitsubishi']),
    color: types.options({ list: ['Red', 'Green', 'Blue'] }),
  })

  const Complex = blueprint.object({
    data: types.options([{ data: 'value' }, 1234, 'abcde']),
    data2: types.options({ list: [100, 200, 300], default: [] }),
  })

  const Complex2 = blueprint.object({
    data: types.options([
      blueprint.object({ key: types.string }),
      { someKey: 'someValue' },
      100,
      180,
    ]),
  })

  expect(Car({ brand: 'Yamaha', color: 'Green' })).toEqual({
    brand: null,
    color: 'Green',
  })

  expect(Car({ brand: 'Yamahaa', color: 'Green' })).toEqual({
    brand: null,
    color: 'Green',
  })

  expect(Complex({ data: { data: 'value' }, data2: '200' })).toEqual({
    data: { data: 'value' },
    data2: [],
  })

  expect(
    Complex2({
      data: 100,
    })
  ).toEqual({
    data: 100,
  })

  expect(
    Complex2({
      data: { someKey: 'someValue' },
    })
  ).toEqual({
    data: { someKey: 'someValue' },
  })

  expect(
    Complex2({
      data: 10,
    })
  ).toEqual({
    data: null,
  })

  expect(
    Complex2({
      data: { key: 'someValue' },
    })
  ).toEqual({
    data: { key: 'someValue' },
  })
})

test('Object array with options type', () => {
  const Complex = blueprint.array({
    data: types.options([100, 200, 'three']),
  })

  const Complex2 = blueprint.array(
    blueprint.object({
      data: types.options([400, 500, 'six']),
    })
  )

  expect(Complex([{ data: 100 }, { data: 200 }, { data: 300 }])).toEqual([
    { data: 100 },
    { data: 200 },
    { data: null },
  ])

  expect(Complex2([{ data: 400 }, { data: 'six' }, { data: 300 }])).toEqual([
    { data: 400 },
    { data: 'six' },
    { data: null },
  ])
})

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
//     { throwOnError: TypeError('The Value Error') }
//   )

//   const ObjInteger3 = blueprint.object(
//     {
//       value: types.integer,
//     },
//     { onError: TypeError('The Value Error') }
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
