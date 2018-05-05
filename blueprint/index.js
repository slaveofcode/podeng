'use strict';

const _ = require('lodash');
const types = require('../types');

const createHandler = (schema, isArrayType = false) => {
  const cls = function(schema, { isArray = false }) {
    this.isArray = isArray;
    this.schema = schema;
    this.processValue = processValue;
    this.serialize = serializeValue;
    this.deserialize = deserializeValue;
  };

  const processValue = function(values) {
    console.log(`Value processed with schema: ${this.schema}`);
    return [false, null, { key1: 'fooo' }];
  };

  const serializeValue = function(values) {
    console.log(`Serialize value processed with schema: ${this.schema}`);
    return [false, null, { serializedkey1: 'fooo' }];
  };

  const deserializeValue = function(values) {
    console.log(`Deserialize value processed with schema: ${this.schema}`);
    return [false, null, { deserializedkey1: 'fooo' }];
  };

  const initHandler = () => {
    const obj = new cls(schema, { isArrayType });

    const doProcessValue = values => {
      console.log('Evaluating input values');
      console.log('Object process calling: ');
      return obj.processValue(values);
    };

    // default process
    const handlerFunc = values => doProcessValue(values);

    handlerFunc.getObject = () => obj;
    handlerFunc.getClass = () => cls;

    return handlerFunc;
  };

  return initHandler();
};

const objectComponent = (
  params,
  options = { giveWarning: false, throwOnError: false },
) => {
  const handler = createHandler(params);

  const errorHandler = (
    isWarning,
    { errorDetails, throwOnError, giveWarning },
  ) => {
    if (isWarning) {
      // check if giveWarning type is object, probably should display warning on specific key with custom handler
      // show warning here
    } else {
      // check if throwOnError type is object, probably should throw error on specific key with custom handler
      // throw error here
    }
  };

  const component = function(values) {
    const [err, errDetails, normalizedValues] = handler(values);
  };

  component.serialize = values => {
    const [err, errorDetails, serializedValues] = handler
      .getObject()
      .serialize(values);

    if (err)
      errorHandler(true, {
        errorDetails,
        throwOnError: options.throwOnError,
        giveWarning: options.giveWarning,
      });

    return serializedValues;
  };

  component.deserialize = values => {
    const [
      err,
      errorDetails,
      deserializedValues,
    ] = handler.getObject().deserialize(values);

    if (err)
      errorHandler(true, {
        errorDetails,
        throwOnError: options.throwOnError,
        giveWarning: options.giveWarning,
      });

    return deserializedValues;
  };

  return component;
};

const arrayComponent = (params, options) => {};

module.exports = {
  object: objectComponent,
  array: arrayComponent,
  types,
};
