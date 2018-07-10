'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use serialize with condition', () => {
  const Person = blueprint.object({
    age: types.conditions({
      evaluates: age => age >= 17,
      onOk: 'Adult',
      onFail: 'Child',
      serialize: {
        to: 'person_age',
      },
    }),
  })

  expect(Person({ age: 35 })).toEqual({ age: 'Adult' })
  expect(Person.serialize({ age: 20 })).toEqual({ person_age: 'Adult' })
  expect(Person.serialize({ age: 15 })).toEqual({ person_age: 'Child' })
})

test('Should be able to use deserialize with condition', () => {
  const Person = blueprint.object({
    age: types.conditions({
      evaluates: age => age >= 17,
      onOk: 'Adult',
      onFail: 'Child',
      deserialize: {
        from: 'the_age',
      },
    }),
  })

  expect(Person({ age: 35 })).toEqual({ age: 'Adult' })
  expect(Person.serialize({ age: 20 })).toEqual({ age: 'Adult' })
  expect(Person.serialize({ age: 15 })).toEqual({ age: 'Child' })
  expect(Person.deserialize({ the_age: 15 })).toEqual({ age: 'Child' })
  expect(Person.deserialize({ the_age: 20 })).toEqual({ age: 'Adult' })
})
