'use strict'

const DEFAULT_OPTIONS = {
  stringify: true,
  hideOnFail: false,
  default: null,
  validate: null
}

const combineDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options)

module.exports = {
  combineDefaultOptions
}
