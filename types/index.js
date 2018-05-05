'use strict';

const string = options => {
  const parse = value => {
    console.log('Parsing string values');
    // handle options
    return [err, value];
  };
  const parser = () => {};
  parser.parse = parse;
  return parser;
};

module.exports = {
  string,
};
