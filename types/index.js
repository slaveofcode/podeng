'use strict';
const { isString, isNumber, isBoolean } = require('./detector');
const stringType = require('./string');
const integerType = require('./integer');
const constantType = require('./constant');

const makeHandler = (parserMaker, validate, getOptions, getTypeOptions) => {
  const handler = (paramsOrOptions = {}) => {
    const typeOptions = getTypeOptions();

    const options = Object.assign(
      getOptions(),
      !typeOptions.isDirectValueSet ? paramsOrOptions : {}
    );

    const objHandler = () => {};

    objHandler.validate = validate;

    objHandler.parse = parserMaker(options);

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
  constant: makeHandler(
    constantType.parserMaker,
    constantType.validate,
    constantType.getOptions,
    constantType.getTypeOptions
  )
};
