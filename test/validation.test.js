'use strict'

const blueprint = require('../blueprint')
const types = require('../types')
const PodengError = require('../validator/errors/PodengError')

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
    const johnDoe = Human({ eyeColor: 'Blue', hairColor: () => {} })
  }

  expect(assignWrongValue).toThrow(PodengError)
})
test('Throw error when validate params via Validator', () => {})
test('Returns error details when checking params via Validator', () => {})
