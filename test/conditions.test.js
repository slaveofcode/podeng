'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to use condition type', () => {
  const Schema = blueprint.object({
    summary: types.conditions(value => value >= 17, 'Adult', 'Child'),
    pass: types.conditions({
      evaluates: birthYear => new Date().getFullYear() - birthYear > 17,
      onOk: 'Yes you pass',
      onFail: 'You Fail',
    }),
  })

  const Schema2 = blueprint.object({
    evaluate: types.conditions(
      value => {
        const v = 'wrong evaluator'
      },
      'Foo',
      'Bar'
    ),
  })

  const throwError = () => {
    blueprint.object({
      value: types.conditions([]),
    })
  }

  expect(Schema({ summary: 10, pass: 1991 })).toEqual({
    summary: 'Child',
    pass: 'Yes you pass',
  })

  expect(Schema({ summary: 27, pass: 2015 })).toEqual({
    summary: 'Adult',
    pass: 'You Fail',
  })

  expect(Schema2({ evaluate: 'sxx' })).toEqual({ evaluate: 'Bar' })

  expect(throwError).toThrow(TypeError('Invalid setup for "conditions" type'))
})

test('Should be able to use multiple condition level', () => {
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

  const SchemaClone1 = blueprint.object({
    age: types.conditions({
      evaluates: age => age >= 17,
      onOk: types.conditions({
        evaluates: age => age >= 30,
        onOk: 'You should find your love',
        onFail: 'Just having fun right now',
      }),
      onFail: 'Child',
    }),
  })

  const Schema2 = blueprint.object({
    age: types.conditions(
      age => age >= 17,
      types.conditions(
        age => age >= 30,
        types.conditions(
          age => age >= 60,
          'Take a rest',
          'You should find your love'
        ),
        'Just having fun right now'
      ),
      'Child'
    ),
  })

  const SchemaClone2 = blueprint.object({
    age: types.conditions({
      evaluates: age => age >= 17,
      onOk: types.conditions(
        age => age >= 30,
        types.conditions(
          age => age >= 60,
          'Take a rest',
          'You should find your love'
        ),
        'Just having fun right now'
      ),
      onFail: 'Child',
    }),
  })

  const Schema3 = blueprint.object({
    age: types.conditions(
      age => age <= 17,
      'Explore the world Child!',
      types.conditions(
        age => age >= 30,
        'find your love',
        types.conditions(
          age => age === 27,
          'Build a startup!',
          'Do whatever you like'
        )
      )
    ),
  })

  const SchemaClone3 = blueprint.object({
    age: types.conditions(
      age => age <= 17,
      'Explore the world Child!',
      types.conditions(
        age => age >= 30,
        'find your love',
        types.conditions({
          evaluates: age => age === 27,
          onOk: 'Build a startup!',
          onFail: 'Do whatever you like',
        })
      )
    ),
  })

  expect(Schema({ age: 35 })).toEqual({ age: 'You should find your love' })
  expect(Schema({ age: 20 })).toEqual({ age: 'Just having fun right now' })
  expect(Schema({ age: 15 })).toEqual({ age: 'Child' })
  expect(SchemaClone1({ age: 35 })).toEqual({
    age: 'You should find your love',
  })
  expect(SchemaClone1({ age: 20 })).toEqual({
    age: 'Just having fun right now',
  })
  expect(SchemaClone1({ age: 15 })).toEqual({ age: 'Child' })

  expect(Schema2({ age: 35 })).toEqual({ age: 'You should find your love' })
  expect(Schema2({ age: 65 })).toEqual({ age: 'Take a rest' })
  expect(SchemaClone2({ age: 35 })).toEqual({
    age: 'You should find your love',
  })
  expect(SchemaClone2({ age: 65 })).toEqual({ age: 'Take a rest' })

  expect(Schema3({ age: 17 })).toEqual({ age: 'Explore the world Child!' })
  expect(Schema3({ age: 27 })).toEqual({ age: 'Build a startup!' })
  expect(Schema3({ age: 42 })).toEqual({ age: 'find your love' })
  expect(SchemaClone3({ age: 17 })).toEqual({ age: 'Explore the world Child!' })
  expect(SchemaClone3({ age: 27 })).toEqual({ age: 'Build a startup!' })
  expect(SchemaClone3({ age: 42 })).toEqual({ age: 'find your love' })
})
