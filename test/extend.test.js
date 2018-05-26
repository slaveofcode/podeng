'use strict';

const { cls: blueprintClass } = require('../blueprint/instance');
const blueprint = require('../blueprint');
const types = require('../types');
const { keys } = require('lodash');

test('Create extensible blueprint object', () => {
  const Car = blueprint.object({
    color: types.string,
    wheels: types.string
  });

  const Bus = blueprint.extend(Car, {
    brand: types.string,
    length: types.string
  });

  expect(Bus.getInstance() instanceof blueprintClass).toBe(true);
  expect(keys(Bus.getParams())).toEqual(['color', 'wheels', 'brand', 'length']);
  expect(
    Bus({
      color: 'Blue',
      wheels: 'Bridgestone',
      brand: 'Mercedes Benz',
      length: '20 meters'
    })
  ).toEqual({
    color: 'Blue',
    wheels: 'Bridgestone',
    brand: 'Mercedes Benz',
    length: '20 meters'
  });
});

test('Create extensible blueprint object with deleted properties', () => {
  const Animal = blueprint.object({
    skin: types.string,
    height: types.string,
    habitat: types.string
  });

  const Human = blueprint.extend(
    Animal,
    {
      talking: types.string
    },
    {},
    { deleteProperties: ['habitat'] }
  );

  expect(keys(Human.getParams())).toEqual(['skin', 'height', 'talking']);
});

test('Create extensible blueprint array object', () => {
  const Animal = blueprint.object({
    skin: types.string,
    height: types.string,
    habitat: types.string
  });

  const Animals = blueprint.array(Animal);

  const throwError = () => {
    blueprint.extend(Animals, {
      talking: types.string
    });
  };

  expect(throwError).toThrowError(
    'To extend you must pass blueprint object, not blueprint array!'
  );
});
