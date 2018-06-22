'use strict';

const blueprint = require('../blueprint');
const types = require('../types');
const PodengError = require('../validator/errors/PodengError');
const Validator = require('../validator');

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
  );

  const assignWrongValue = () => {
    Human({ eyeColor: 'Blue', hairColor: () => {} });
  };

  expect(assignWrongValue).toThrow(PodengError);
});

test('Throw error when validate params via Validator', () => {
  const Human = blueprint.object({
    eyeColor: types.string,
    hairColor: types.string
  });

  const validator = Validator(Human);

  const validate = () => {
    validator.validate({ eyeColor: 'Blue', hairColor: () => {} });
  };

  expect(validate).toThrow(PodengError);
});

test('Returns error details when checking params via Validator', () => {
  const Human = blueprint.object({
    eyeColor: types.string,
    hairColor: types.string
  });

  const validator = Validator(Human);

  const [err, errDetails] = validator.check({
    eyeColor: 'Blue',
    hairColor: () => {}
  });

  expect(err).toBe(true);
  expect(errDetails).toEqual({
    hairColor: ['failed to parse "hairColor" with its type']
  });
});

test('Able to validate using object serialize params', () => {
  const Human = blueprint.object({
    eyeColor: types.string({ serialize: { to: 'eye_color' } }),
    hairColor: types.string({ min: 5, deserialize: { from: 'hair_color' } }),
    skin_color: types.string
  });

  const validator = Validator(Human);
  const validator2 = Validator(Human, { deserialization: true });

  const throwErr1 = () => {
    validator.validate({
      eyeColor: 'Blue',
      hairColor: 'Red',
      skin_color: 'Brown'
    });
  };

  const notThrowErr = () => {
    validator2.validate({
      eye_color: 'Blue',
      hair_color: 'Green',
      skin_color: 'Brown'
    });
  };

  const [err1, errDetails1] = validator.check({
    eyeColor: 'Blue',
    hairColor: 'Red',
    skin_color: 'Brown'
  });

  const [err2, errDetails2] = validator2.check({
    eye_color: 'Blue',
    hair_color: 'Red',
    skin_color: 'Brown'
  });

  expect(throwErr1).toThrow(PodengError);
  expect(notThrowErr).not.toThrow(PodengError);

  expect(err1).toBe(true);
  expect(errDetails1).toEqual({
    hairColor: ['Minimum value of "hairColor" is 5']
  });

  expect(err2).toBe(true);
  expect(errDetails2).toEqual({
    hairColor: ['Minimum value of "hair_color" is 5']
  });
});
