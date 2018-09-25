'use strict';

const { isString, isNumber, isBoolean } = require('../../types/detector');
const { combineEmbedDefaultOptions } = require('../utils');

const EmbedCls = function (instanceCls, options = {}) {
  this.options = combineEmbedDefaultOptions(options);
  this.instance = instanceCls;

  this.getOptions = function () {
    return this.options;
  };
  this.getObject = function () {
    return this.instance;
  };
  this.getSerializeName = function () {
    return (isString(this.options.serialize.to) || isNumber(this.options.serialize.to)
      ? this.options.serialize.to
      : null);
  };

  this.getDeserializeName = function () {
    return (isString(this.options.deserialize.from) || isNumber(this.options.deserialize.from)
      ? this.options.deserialize.from
      : null);
  };

  this.isHideOnSerialization = function () {
    return !(isBoolean(this.options.serialize.display) ? this.options.serialize.display : true);
  };

  this.isHideOnDeserialization = function () {
    return !(isBoolean(this.options.deserialize.display)
      ? this.options.deserialize.display
      : true);
  };

  this.isHideOnFail = function () { return this.options.hideOnFail; };
};

module.exports = EmbedCls;
