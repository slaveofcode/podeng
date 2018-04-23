'use strict';

const baseType = (name, parserFunc) => {
  return (props = {}) => {
    this.parse = parserFunc;
    this.props = props;
    this.getName = () => name;
  };
};


const string = baseType('STRING', )