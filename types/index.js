'use strict';

const { fetchProvidedOptions } = require('./utils');
const { isString, isNumber, isBoolean } = require('./detector');
const stringType = require('./string');
const integerType = require('./integer');
const floatType = require('./float');
const numberType = require('./number');
const optionsType = require('./options');
const conditionsType = require('./conditions');
const booleanType = require('./boolean');
const transformType = require('./transform');
const datetimeType = require('./datetime');

const makeHandler = ({ parserMaker, validate, getOptions, getTypeOptions }) => {
  const handler = (...paramsOrOptions) => {
    const typeOptions = getTypeOptions();

    const directValueSet = typeOptions.isDirectValueSet;

    const additionalOptions = directValueSet
      ? fetchProvidedOptions(getOptions(), paramsOrOptions)
      : paramsOrOptions[0];
    const options = Object.assign(getOptions(), additionalOptions);

    const objHandler = () => {};

    objHandler.validate = validate;

    const parseArgs = directValueSet ? paramsOrOptions : [options];
    objHandler.parse = parserMaker.apply(null, parseArgs);

    /**
     * Returning serialized name if set
     * default is null
     */
    objHandler.getSerializeName = () =>
      (isString(options.serialize.to) || isNumber(options.serialize.to)
        ? options.serialize.to
        : null);

    /**
     * Returning deserialized name if set
     * default is null
     */
    objHandler.getDeserializeName = () =>
      (isString(options.deserialize.from) || isNumber(options.deserialize.from)
        ? options.deserialize.from
        : null);

    /**
     * Returning status of hide the value on serialization
     */
    objHandler.isHideOnSerialization = () =>
      !(isBoolean(options.serialize.display) ? options.serialize.display : true);

    objHandler.isHideOnDeserialization = () =>
      !(isBoolean(options.deserialize.display)
        ? options.deserialize.display
        : true);

    objHandler.isHideOnFail = () => options.hideOnFail;

    objHandler.getOptions = () => options;

    return objHandler;
  };

  return handler;
};

module.exports = {
  string: makeHandler(stringType),
  integer: makeHandler(integerType),
  float: makeHandler(floatType),
  number: makeHandler(numberType),
  options: makeHandler(optionsType),
  conditions: makeHandler(conditionsType),
  bool: makeHandler(booleanType),
  transform: makeHandler(transformType),
  datetime: makeHandler(datetimeType)
};
