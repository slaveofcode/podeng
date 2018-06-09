'use strict';

/* eslint-disable */

const blueprint = require("../blueprint");
const types = require("../types");

test("Should be able to use condition type", () => {
  const Schema = blueprint.object({
    summary: types.conditions(value => value >= 17, "Adult", "Child"),
    pass: types.conditions({
      evaluates: birthYear => new Date().getFullYear() - birthYear > 17,
      onOk: "Yes you pass",
      onFail: "You Fail"
    })
  });

  const Schema2 = blueprint.object({
    evaluate: types.conditions(
      value => {
        const v = "wrong evaluator";
      },
      "Foo",
      "Bar"
    )
  });

  const throwError = () => {
    blueprint.object({
      value: types.conditions([])
    });
  };

  expect(Schema({ summary: 10, pass: 1991 })).toEqual({
    summary: "Child",
    pass: "Yes you pass"
  });

  expect(Schema({ summary: 27, pass: 2015 })).toEqual({
    summary: "Adult",
    pass: "You Fail"
  });

  expect(Schema2({ evaluate: "sxx" })).toEqual({ evaluate: "Bar" });

  expect(throwError).toThrow(TypeError('Invalid setup for "conditions" type'));
});
