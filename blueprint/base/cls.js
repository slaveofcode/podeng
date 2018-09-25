'use strict';

const normalize = require('../functions/normalize');
const serialize = require('../functions/serialize');
const deserialize = require('../functions/deserialize');

const cls = function (schema, options = {}, { isArray = false }) {
  this.isArray = isArray;
  this.schema = schema;
  this.options = options;

  this.normalize = normalize;
  this.serialize = serialize;
  this.deserialize = deserialize;
};

module.exports = cls;
