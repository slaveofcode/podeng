'use strict';

const blueprint = require('../blueprint');
const types = require('../types');
const PodengError = require('../validator/errors/PodengError');
const Validator = require('../validator');

test('Throw error when throw options set via non Validator', () => {
  const Obj1 = blueprint.object(
    {
      num: types.number,
      num2: types.number
    },
    {
      throwOnError: true,
      giveWarning: true
    }
  );

  const assignWrongValue = () => {
    Obj1({ num: 'Blue', num2: () => {} });
  };

  expect(assignWrongValue).toThrow(PodengError);
});

test('Throw error when validate params via Validator', () => {
  const Obj1 = blueprint.object({
    num: types.number,
    num2: types.number
  });

  const validator = Validator(Obj1);

  const validate = () => {
    validator.validate({ num: 'Blue', num2: () => {} });
  };

  expect(validate).toThrow(PodengError);
});

test('Returns error details when checking params via Validator', () => {
  const Obj1 = blueprint.object({
    num: types.number,
    num2: types.number
  });

  const validator = Validator(Obj1);

  const [err, errDetails] = validator.check({
    num: '100.34',
    num2: () => {}
  });

  expect(err).toBe(true);
  expect(errDetails).toEqual({
    num2: ['failed to parse "num2" with its type']
  });
});

test('Able to validate using object serialize params', () => {
  const Obj1 = blueprint.object({
    num: types.number({ serialize: { to: 'number1' } }),
    num2: types.number({ min: 5.45, deserialize: { from: 'number2' } }),
    num3: types.integer
  });

  const validator = Validator(Obj1);
  const validator2 = Validator(Obj1, { deserialization: true });

  const throwErr1 = () => {
    validator.validate({
      num: 10,
      num2: 20,
      num3: 'stringss'
    });
  };

  const notThrowErr = () => {
    validator2.validate({
      number1: 10,
      number2: '20',
      num3: '30'
    });
  };

  const [err1, errDetails1] = validator.check({
    num: 10,
    num2: 3,
    num3: '30'
  });

  const [err2, errDetails2] = validator2.check({
    number1: 10,
    number2: '2',
    num3: '30'
  });

  expect(throwErr1).toThrow(PodengError);
  expect(notThrowErr).not.toThrow(PodengError);

  expect(err1).toBe(true);
  expect(errDetails1).toEqual({
    num2: ['Minimum value of "num2" is 5.45']
  });

  expect(err2).toBe(true);
  expect(errDetails2).toEqual({
    number2: ['Minimum value of "number2" is 5.45']
  });
});
