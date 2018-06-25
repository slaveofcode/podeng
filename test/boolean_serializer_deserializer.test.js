'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    good: types.bool({ serialize: { to: 'good_status' } })
  });

  expect(Obj1.serialize({ good: true })).toEqual({ good_status: true });
  expect(Obj1.deserialize({ good_status: '20' })).toEqual({ good: false });
  expect(Obj1.deserialize({ good_status: false })).toEqual({ good: false });
});

// test('Object able to serialize and deserialize with custom deserialize rules', () => {
//   const Obj1 = blueprint.object({
//     num: types.float({
//       serialize: { to: 'number' },
//       deserialize: { from: 'a_number' }
//     })
//   });

//   const Obj2 = blueprint.object({
//     num: types.float({
//       min: 100,
//       serialize: { to: 'number' }
//     })
//   });

//   expect(Obj1.serialize({ num: '20' })).toEqual({ number: null });
//   expect(Obj1.serialize({ num: '20.50' })).toEqual({ number: 20.50 });
//   expect(Obj1.deserialize({ a_number: '50.32' })).toEqual({ num: 50.32 });
//   expect(Obj2.deserialize({ number: 200 })).toEqual({ num: null });
//   expect(Obj2.deserialize({ number: 200.55 })).toEqual({ num: 200.55 });
//   expect(Obj2.deserialize({ number: 10 })).toEqual({ num: null });
//   expect(Obj2.deserialize({ number: 99.99 })).toEqual({ num: null });
// });

// test('Object able to hide on serialize', () => {
//   const Obj1 = blueprint.object({
//     num: types.float({
//       serialize: { to: 'a_number' }
//     }),
//     num2: types.float({ serialize: { display: false } })
//   });

//   expect(Obj1.serialize({ num: 30, num2: '100' })).toEqual({
//     a_number: null
//   });
//   expect(Obj1.serialize({ num: 50.30, num2: '100' })).toEqual({
//     a_number: 50.30
//   });
//   expect(Obj1({ num: 30.22, num2: '100.123' })).toEqual({
//     num: 30.22,
//     num2: 100.123
//   });
// });
