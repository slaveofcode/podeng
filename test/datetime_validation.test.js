'use strict';

const blueprint = require('../blueprint');
const types = require('../types');
const PodengError = require('../validator/errors/PodengError');
const Validator = require('../validator');

test('Throw error when throw options set via non Validator', () => {
  const Obj1 = blueprint.object(
    {
      key: types.datetime,
      key2: types.datetime('DD-MM-YYYY')
    },
    {
      throwOnError: true,
      giveWarning: true
    }
  );

  const assignWrongValue = () => {
    Obj1({ key: '1991-06-18', key2: '1991-06-18' });
    console.log(Obj1({ key: '1991-06-18', key2: '1991-06-18' }));
  };

  expect(assignWrongValue).toThrow(PodengError);
});

test('Throw error when validate params via Validator', () => {
  const Obj1 = blueprint.object({
    key: types.datetime,
    key2: types.datetime
  });

  const validator = Validator(Obj1);

  const validate = () => {
    validator.validate({ key: 123, key2: '2017-12-01' });
  };

  expect(validate).toThrow(PodengError);
});

test('Returns error details when checking params via Validator', () => {
  const Obj1 = blueprint.object({
    key: types.datetime,
    key2: types.datetime
  });

  const validator = Validator(Obj1);

  const [err, errDetails] = validator.check({
    key: 'foo',
    key2: 'bar'
  });

  expect(err).toBe(true);
  expect(errDetails).toEqual({
    key: ['Unable to parse "key" with value: foo'],
    key2: ['Unable to parse "key2" with value: bar']
  });
});

test('Able to validate using object serialize params', () => {
  const Obj1 = blueprint.object({
    key: types.datetime({ serialize: { to: 'key1' } }),
    key2: types.datetime({
      parseFormat: 'DD-MM-YYYY',
      deserialize: { from: 'key_2' }
    }),
    key3: types.datetime
  });

  const validator = Validator(Obj1);
  const validator2 = Validator(Obj1, { deserialization: true });

  const throwErr1 = () => {
    validator.validate({
      key: 123,
      key2: '1991-06-18',
      key3: 'foo'
    });
  };

  const notThrowErr = () => {
    validator2.validate({
      key1: '1991-06-18',
      key_2: '18-06-1991',
      key3: '1991-06-18'
    });
  };

  const [err1, errDetails1] = validator.check({
    key: 123,
    key2: '1991-06-18',
    key3: 'foo'
  });

  const [err2, errDetails2] = validator2.check({
    key1: '1991-06-18',
    key_2: '1991-06-18',
    key3: '1991-06-18'
  });

  expect(throwErr1).toThrow(PodengError);
  expect(notThrowErr).not.toThrow(PodengError);

  expect(err1).toBe(true);
  expect(errDetails1).toEqual({
    key: ['Unable to parse "key" with value: 123'],
    key2: ['Unable to parse "key2" with value: 1991-06-18'],
    key3: ['Unable to parse "key3" with value: foo']
  });

  expect(err2).toBe(true);
  expect(errDetails2).toEqual({
    key_2: ['Unable to parse "key_2" with value: 1991-06-18']
  });
});
