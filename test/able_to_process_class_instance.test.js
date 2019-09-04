'use strict';

/* eslint-disable */

const blueprint = require("../blueprint");
const types = require("../types");

test("Should able to process a class instance", () => {
  const Obj = blueprint.object(
    {
      val1: types.any,
      val2: types.any()
    },
    { allowUnknownProperties: true, frozen: true }
  );

  const Obj2 = blueprint.extend(
    Obj,
    {
      val1: types.any({ allowUndefined: true }),
      val2: types.any()
    },
    { frozen: true }
  );

  const x = function() {};
  x.prototype.val1 = 1;
  x.prototype.val2 = 2;
  x.prototype.val3 = 10;

  const nx = new x();

  expect(Obj(nx)).toEqual({
    val1: 1,
    val2: 2
  });
  expect(Obj2({ val1: 1, val2: 2, val3: 10 })).toEqual({
    val1: 1,
    val2: 2,
    val3: 10
  });
});
