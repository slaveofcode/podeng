'use strict';

/* eslint-disable */

const blueprint = require("../blueprint");
const types = require("../types");

test("Should be executed once for transform function in embed", () => {
  const expSchema = blueprint.object({
    id: types.transform(id => {
      return "abc" + id;
    })
  });

  const expSchema2 = blueprint.object({
    emb: expSchema
  });

  const res = expSchema2({
    emb: {
      id: 123
    }
  });

  expect(res.emb.id).toEqual("abc123");
});

test("Should be executed once for transform function in embed in serialization", () => {
  const expSchema = blueprint.object({
    id: types.transform(id => {
      return "abc" + id;
    })
  });

  const expSchema2 = blueprint.object({
    emb: expSchema
  });

  const expSchema3 = blueprint.array({
    emb: expSchema
  });

  const res = expSchema2.serialize({
    emb: {
      id: 123
    }
  });

  const res2 = expSchema3.serialize([
    {
      emb: {
        id: 456
      }
    }
  ]);

  expect(res.emb.id).toEqual("abc123");
  expect(res2[0].emb.id).toEqual("abc456");
});

test("Should be executed once for transform function in embed in deserialization", () => {
  const expSchema = blueprint.object({
    id: types.transform(
      id => {
        return "abc" + id;
      },
      { deserialize: { from: "number" } }
    )
  });

  const expSchema2 = blueprint.object({
    emb: expSchema
  });

  const expSchema3 = blueprint.array({
    emb: expSchema
  });

  const res = expSchema2.deserialize({
    emb: {
      number: 123
    }
  });

  const res2 = expSchema3.deserialize([
    {
      emb: {
        number: 456
      }
    }
  ]);

  expect(res.emb.id).toEqual("abc123");
  expect(res2[0].emb.id).toEqual("abc456");
});
