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

  const Complex1 = blueprint.array({
    data: types.options({ list: [100, 200, 'three'] }),
  })

  const Complex2 = blueprint.array(
    blueprint.object({
      data: types.options([400, 500, 'six']),
    })
  )

  const Complex3 = blueprint.array(
    blueprint.object({
      data: types.options({ list: [400, 500, 'six'] }),
    })
  )

  expect(Complex([{ data: 100 }, { data: 200 }, { data: 300 }])).toEqual([
    { data: 100 },
    { data: 200 },
    { data: null },
  ])

  expect(Complex1([{ data: 100 }, { data: 200 }, { data: 300 }])).toEqual([
    { data: 100 },
    { data: 200 },
    { data: null },
  ])

  expect(Complex2([{ data: 400 }, { data: 'six' }, { data: 300 }])).toEqual([
    { data: 400 },
    { data: 'six' },
    { data: null },
  ])

  expect(Complex3([{ data: 400 }, { data: 'six' }, { data: 300 }])).toEqual([
    { data: 400 },
    { data: 'six' },
    { data: null },
  ])
})

test('Object include integer with validation', () => {
  const Validate = blueprint.object(
    {
      data: types.options(['valid_1', 'valid_2']),
    },
    { throwOnError: true }
  )

  const Validate2 = blueprint.object(
    {
      number: types.options([100, 200, 340]),
    },
    {
      throwOnError: new TypeError('Error on Validate2'),
    }
  )

  const fnToExec1 = params => () => Validate(params)
  const fnToExec2 = params => () => Validate2(params)

  expect(fnToExec1({ data: () => {} })).toThrow(PodengError)
  expect(fnToExec1({ data: 'valid_3' })).toThrow(PodengError)
  expect(fnToExec2({ data: 350 })).toThrow(TypeError('Error on Validate2'))
})
