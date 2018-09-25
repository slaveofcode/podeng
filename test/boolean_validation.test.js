'use strict';

const blueprint = require('../blueprint');
const types = require('../types');
const PodengError = require('../validator/errors/PodengError');
const Validator = require('../validator');

test('Throw error when throw options set via non Validator', () => {
  const Obj1 = blueprint.object(
    {
      key: types.bool,
      key2: types.bool(['Yes', 'True', 'Yup'])
    },
    {
      throwOnError: true,
      giveWarning: true
    }
  );

  const assignWrongValue = () => {
    Obj1({ key: 'Blue', key2: 123 });
  };

  expect(assignWrongValue).toThrow(PodengError);
});

test('Throw error when validate params via Validator', () => {
  const Obj1 = blueprint.object({
    key: types.bool,
    key2: types.bool
  });

  const validator = Validator(Obj1);

  const validate = () => {
    validator.validate({ key: 'Blue', key2: 123 });
  };

  expect(validate).toThrow(PodengError);
});

test('Returns error details when checking params via Validator', () => {
  const Obj1 = blueprint.object({
    key: types.bool,
    key2: types.bool
  });

  const validator = Validator(Obj1);

  const [err, errDetails] = validator.check({
    key: '100.34',
    key2: () => {}
  });

  expect(err).toBe(true);
  expect(errDetails).toEqual({
    key: ['failed to parse "key" with its type'],
    key2: ['failed to parse "key2" with its type']
  });
});

test('Able to validate using object serialize params', () => {
  const Obj1 = blueprint.object({
    key: types.bool({ serialize: { to: 'key1' } }),
    key2: types.bool({ deserialize: { from: 'key_2' } }),
    key3: types.bool
  });

  const validator = Validator(Obj1);
  const validator2 = Validator(Obj1, { deserialization: true });

  const throwErr1 = () => {
    validator.validate({
      key: 10,
      key2: 20,
      key3: 'stringss'
    });
  };

  const notThrowErr = () => {
    validator2.validate({
      key1: true,
      key_2: false,
      key3: true
    });
  };

  const [err1, errDetails1] = validator.check({
    key: 10,
    key2: true,
    key3: '30'
  });

  const [err2, errDetails2] = validator2.check({
    key1: 10,
    key_2: '2',
    key3: '30'
  });

  expect(throwErr1).toThrow(PodengError);
  expect(notThrowErr).not.toThrow(PodengError);

  expect(err1).toBe(true);
  expect(errDetails1).toEqual({
    key: ['failed to parse "key" with its type'],
    key3: ['failed to parse "key3" with its type']
  });

  expect(err2).toBe(true);
  expect(errDetails2).toEqual({
    key1: ['failed to deserialize from "key1" to "key" with its type'],
    key_2: ['failed to deserialize from "key_2" to "key2" with its type'],
    key3: ['failed to deserialize from "key3" to "key3" with its type']
  });
});
