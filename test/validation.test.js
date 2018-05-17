'use strict'

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')
const Validator = require('../validator')

test('Throw error when throw options set via non Validator', () => {
  const Human = blueprint.object(
    {
      eyeColor: types.string,
      hairColor: types.string
    },
    {
      throwOnError: true,
      giveWarning: true
    }
  )

  const assignWrongValue = () => {
    Human({ eyeColor: 'Blue', hairColor: () => {} })
  }

  expect(assignWrongValue).toThrow(PodengError)
})

test('Throw error when validate params via Validator', () => {
  const Human = blueprint.object({
    eyeColor: types.string,
    hairColor: types.string
  })

  const validator = Validator(Human)

  const validate = () => {
    validator.validate({ eyeColor: 'Blue', hairColor: () => {} })
  }

  expect(validate).toThrow(PodengError)
})

test('Returns error details when checking params via Validator', () => {
  const Human = blueprint.object({
    eyeColor: types.string,
    hairColor: types.string
  })

  const validator = Validator(Human)

  const [err, errDetails] = validator.check({
    eyeColor: 'Blue',
    hairColor: () => {}
  })

  expect(err).toBe(true)
  expect(errDetails).toEqual({
    hairColor: 'failed to parse hairColor as a String type'
  })
})
