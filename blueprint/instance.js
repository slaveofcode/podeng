'use strict'

const { includes, keys, forEach } = require('lodash')

const cls = function (schema, { isArray = false }) {
  this.isArray = isArray
  this.schema = schema
  this.normalizeValue = normalizeValue
  this.serialize = serializeValue
  this.deserialize = deserializeValue
}

const normalizeValue = function (valuesToNormalize) {
  const normalizedResult = {}
  const errorResults = []

  const initiateTypeHandler = typehandler => {
    if (includes(keys(typehandler), 'parse')) {
      return typehandler
    } else {
      return typehandler()
    }
  }

  forEach(this.schema, (typeHandler, key) => {
    const handler = initiateTypeHandler(typeHandler)
    const [fail, normalizedValue] = handler.parse(valuesToNormalize[key])
    if (!fail || (fail && !handler.isHideOnFail())) {
      normalizedResult[key] = normalizedValue
    }
  })
  return [false, null, normalizedResult]
}

const serializeValue = function (values) {
  console.log(`Serialize value processed with schema: ${this.schema}`)
  return [false, null, { serializedkey1: 'fooo' }]
}

const deserializeValue = function (values) {
  console.log(`Deserialize value processed with schema: ${this.schema}`)
  return [false, null, { deserializedkey1: 'fooo' }]
}

module.exports = {
  cls
}
