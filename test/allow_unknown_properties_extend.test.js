'use strict';

/* eslint-disable */

const blueprint = require('../blueprint')
const types = require('../types')

test('Should be able to allow unknown properties on extended object', () => {
    const Obj = blueprint.object({
        val1: types.any,
        val2: types.any(),
    }, { allowUnknownProperties: true });

    const Obj2 = blueprint.extend(Obj, {
        val1: types.any({ allowUndefined: true }),
        val2: types.any(),
    })

    expect(Obj({ val1: 1, val2: 2, val3: 10 })).toEqual({
        val1: 1,
        val2: 2,
        val3: 10
    })
    expect(Obj2({ val1: 1, val2: 2, val3: 10 })).toEqual({
        val1: 1,
        val2: 2,
        val3: 10
    })
})
