'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to extend array object', () => {
    const Obj = blueprint.array({
        val1: types.integer,
        val2: types.integer,
    }, { allowUnknownProperties: true });

    const Obj2 = blueprint.extend(Obj, {
        val1: types.float,
        val2: types.float,
    })

    const throwError = () => {
        blueprint.extend(Obj, {
            val1: types.any,
            val2: types.any,
        })
    }

    expect(Obj([{ val1: 1, val2: 2, val3: 10 }])).toEqual([{
        val1: 1,
        val2: 2,
        val3: 10
    }])
    expect(Obj2([{ val1: 1.03, val2: 2.34, val3: 10.08 }])).toEqual([{
        val1: 1.03,
        val2: 2.34,
        val3: 10.08
    }])
    expect(throwError).not.toThrow(TypeError('To extend you must pass blueprint object, not blueprint array!'))
})
