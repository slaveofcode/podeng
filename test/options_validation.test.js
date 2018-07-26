'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')
const validator = require('../validator')
const PodengError = require('../validator/errors/PodengError')

test('Validate using list from options list', () => {
  const Car = blueprint.object({
    wheels: types.integer({ default: 4 }),
    color: types.options({ list: ['Red', 'Green', 'Blue'] }),
    brand: types.string,
  })

  const Truck = blueprint.extend(Car, {
    wheels: types.integer({ default: 6 }),
  })

  const CarValidator = validator(Car)
  const TruckValidator = validator(Truck)

  const funcOk1 = () => {
    CarValidator.validate({ brand: 'Foo', color: 'Green', wheels: 5 })
  }

  const funcOk2 = () => {
    TruckValidator.validate({ brand: 123, color: 'Green', wheels: 5 })
  }

  const funcNotOk = () => {
    TruckValidator.validate({ brand: 123, color: 'white', wheels: 5 })
  }

  const funcNotOk2 = () => {
    TruckValidator.validate({ color: 'white', wheels: 5 })
  }

  expect(funcOk1).not.toThrow(PodengError)
  expect(funcOk2).not.toThrow(PodengError)
  expect(funcNotOk).toThrow(PodengError)
  expect(funcNotOk2).toThrow(PodengError)
})

test('Validate using list from params', () => {
  const Car = blueprint.object({
    wheels: types.integer({ default: 4 }),
    color: types.options(['Red', 'Green', 'Blue']),
    brand: types.string,
  })

  const Truck = blueprint.extend(Car, {
    wheels: types.integer({ default: 6 }),
  })

  const CarValidator = validator(Car)
  const TruckValidator = validator(Truck)

  const funcOk1 = () => {
    CarValidator.validate({ brand: 'Foo', color: 'Green', wheels: 5 })
  }

  const funcOk2 = () => {
    TruckValidator.validate({ brand: 123, color: 'Green', wheels: 5 })
  }

  const funcNotOk = () => {
    TruckValidator.validate({ brand: 123, color: 'white', wheels: 5 })
  }

  const funcNotOk2 = () => {
    TruckValidator.validate({ color: 'white', wheels: 5 })
  }

  expect(funcOk1).not.toThrow(PodengError)
  expect(funcOk2).not.toThrow(PodengError)
  expect(funcNotOk).toThrow(PodengError)
  expect(funcNotOk2).toThrow(PodengError)
})
