'use strict'

const DEFAULT_OPTIONS = {
  frozen: true,
  giveWarning: false,
  throwOnError: false
}

const combineObjDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options)

module.exports = {
  combineObjDefaultOptions
}
