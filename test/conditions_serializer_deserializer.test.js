'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use serialize with condition', () => {
  const Schema = blueprint.object({
    age: types.conditions(
      age => age >= 17,
      types.conditions(
        age => age >= 30,
        'You should find your love',
        'Just having fun right now'
      ),
      'Child'
    ),
  })

  expect(Schema({ age: 35 })).toEqual({ age: 'You should find your love' })
  expect(Schema({ age: 20 })).toEqual({ age: 'Just having fun right now' })
  expect(Schema({ age: 15 })).toEqual({ age: 'Child' })
})
