'use strict'

const blueprint = require('../blueprint')
const types = require('../types')

test('Throw error when throw options set via non Validator', () => {
  const Human = blueprint.object(
    {
      eyeColor: types.string,
      hairColor: types.string
    },
    {
      throwOnError: true
    }
  )

  try {
    const johnDoe = Human({ eyeColor: 'Blue', hairColor: () => {} })
  } catch (err) {
    // console.log(err)
    // console.log(err.message)
    // console.log(err.why)
    // console.log(err.stack)
    // console.log(err.details)
  }

  const assignWrongValue = () => {
    const johnDoe = Human({ eyeColor: 'Blue', hairColor: () => {} })
  }

  expect(assignWrongValue).toThrow()
})
test('Throw error when validate params via Validator', () => {})
test('Returns error details when checking params via Validator', () => {})
