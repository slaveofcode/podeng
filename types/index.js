'use strict';
const { isString, isNumber, isBoolean } = require('./detector');
const stringType = require('./string');

const makeHandler = (parserMaker, validate, getOptions) => {
  const handler = (options = {}) => {
    options = Object.assign(getOptions(), options);

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
    stringType.getOptions
  )
};
