'use strict';
const { isString, isNumber, isBoolean } = require('./detector');
const stringType = require('./string');
const integerType = require('./integer');
const optionsType = require('./options');
const conditionsType = require('./conditions');

const makeHandler = (parserMaker, validate, getOptions, getTypeOptions) => {
  const handler = (...paramsOrOptions) => {
    const typeOptions = getTypeOptions();

    const directValueSet = typeOptions.isDirectValueSet;

    const additionalOptions = directValueSet ? {} : paramsOrOptions[0];
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
      isString(options.serialize.to) || isNumber(options.serialize.to)
        ? options.serialize.to
        : null;

    /**
     * Returning deserialized name if set
     * default is null
     */
    objHandler.getDeserializeName = () =>
      isString(options.deserialize.from) || isNumber(options.deserialize.from)
        ? options.deserialize.from
        : null;

    /**
     * Returning status of hide the value on serialization
     */
    objHandler.isHideOnSerialization = () =>
      !(isBoolean(options.serialize.display)
        ? options.serialize.display
        : true);

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
  string: makeHandler(
    stringType.parserMaker,
    stringType.validate,
    stringType.getOptions,
    stringType.getTypeOptions
  ),
  integer: makeHandler(
    integerType.parserMaker,
    integerType.validate,
    integerType.getOptions,
    integerType.getTypeOptions
  ),
  options: makeHandler(
    optionsType.parserMaker,
    optionsType.validate,
    optionsType.getOptions,
    optionsType.getTypeOptions
  ),
  conditions: makeHandler(
    conditionsType.parserMaker,
    conditionsType.validate,
    conditionsType.getOptions,
    conditionsType.getTypeOptions
  )
};
