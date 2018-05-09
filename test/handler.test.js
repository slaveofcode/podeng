'use strict'

const { cls: blueprintClass } = require('../blueprint/instance')
const blueprint = require('../blueprint')
const types = require('../types')

test('Create an instace of blueprint object', () => {
  const Car = blueprint.object({
    type: types.string
  })

  expect(typeof Car).toEqual('function')
  expect(Car.getInstance() instanceof blueprintClass).toBe(true)
})

test('Create an instance of blueprint array', () => {
  const Car = blueprint.object({
    type: types.string
  })

  const Cars = blueprint.array({ type: types.string() })
  const Cars2 = blueprint.array(Car)

  expect(typeof Cars).toEqual('function')
  expect(Cars.getInstance() instanceof blueprintClass).toBe(true)
  expect(Cars2.getInstance() instanceof blueprintClass).toBe(true)
})

test('Make sure blueprint object working with at least one type', () => {
  const Car = blueprint.object({
    type: types.string
  })
  const Car2 = blueprint.object({
    type: types.string()
  })

  const Cars = blueprint.array({ type: types.string() })
  const Cars2 = blueprint.array(Car)

  expect(Car({ type: 'Honda' })).toEqual({ type: 'Honda' })
  expect(Car2({ type: 'Honda' })).toEqual({ type: 'Honda' })
  expect(Cars([{ type: 'Honda' }])).toEqual([{ type: 'Honda' }])
  expect(Cars2([{ type: 'Honda' }])).toEqual([{ type: 'Honda' }])
})
