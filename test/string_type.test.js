'use strict';

const blueprint = require('../blueprint');
const types = require('../types');

// test('Object include string type', () => {
//   const Car = blueprint.object({
//     type: types.string,
//   });

//   expect(typeof Car).toEqual('function');
// });

test('Hide value on wrong type passed', () => {
  const Car = blueprint.object({
    type: types.string({ hideOnFail: true }),
    color: types.string,
  });

  const Person1 = blueprint.object({
    name: types.string({ min: 4 }),
  });

  const Person2 = blueprint.object({
    name: types.string({ max: 30 }),
  });

  const Person3 = blueprint.object({
    name: types.string({ min: 4, max: 30 }),
  });

  expect(Car({ type: {}, color: 'black' })).toEqual({ color: 'black' });
  expect(Person1({ name: 'Aditya' })).toEqual({ name: 'Aditya' });
  expect(Person1({ name: 'Ad' })).toEqual({ name: null });
  expect(Person2({ name: 'Ad' })).toEqual({ name: 'Ad' });
  expect(
    Person2({ name: 'Lorem Ipsum is simply dummy text of the printing' }),
  ).toEqual({ name: null });
  expect(Person3({ name: 'Ad' })).toEqual({ name: null });
  expect(
    Person3({ name: 'Lorem Ipsum is simply dummy text of the printing' }),
  ).toEqual({ name: null });
  expect(Person3({ name: 'Aditya' })).toEqual({ name: 'Aditya' });
});

// test('Object include string type with json stringify and custom default value', () => {
//   const ObjStringify = blueprint.object({
//     value: types.string,
//   });

//   const ObjNonStringify = blueprint.object({
//     value: types.string({ stringify: false }),
//   });

//   const DefaultValue = blueprint.object({
//     value: types.string({ stringify: false, default: 'Empty' }),
//   });

//   const DefaultValueFunc = blueprint.object({
//     value: types.string({ stringify: false, default: () => 'ValueFunc' }),
//   });

//   expect(ObjStringify({ value: { age: 27 } })).toEqual({
//     value: '{"age":27}',
//   });
//   expect(ObjNonStringify({ value: {} })).toEqual({
//     value: null,
//   });
//   expect(DefaultValue({ value: {} })).toEqual({
//     value: 'Empty',
//   });
//   expect(DefaultValueFunc({ value: {} })).toEqual({
//     value: 'ValueFunc',
//   });
// });

// test('Object array with string options', () => {
//   const ObjString = blueprint.object({
//     value1: types.string({ normalize: 'uppercased' }),
//     value2: types.string({ normalize: 'lowercased' }),
//   });

//   const Collections = blueprint.array(ObjString);

//   expect(
//     Collections([
//       { value1: 'this will be uppercased', value2: 'THIS WILL BE LOWERCASED' },
//       { value1: 'foo', value2: 'BAR' },
//       { value1: 'john', value2: 'DOE' },
//     ]),
//   ).toEqual([
//     {
//       value1: 'THIS WILL BE UPPERCASED',
//       value2: 'this will be lowercased',
//     },
//     { value1: 'FOO', value2: 'bar' },
//     { value1: 'JOHN', value2: 'doe' },
//   ]);
// });

// test('Object include string with normalize options', () => {
//   const ObjString = blueprint.object({
//     value1: types.string({ normalize: 'uppercased' }),
//     value2: types.string({ normalize: 'lowercased' }),
//     value3: types.string({ normalize: 'trimmed' }),
//     value4: types.string({ normalize: 'upper_first' }),
//     value5: types.string({ normalize: 'upper_first_word' }),
//     value6: types.string({ normalize: 'lower_first' }),
//     value7: types.string({ normalize: 'lower_first_word' }),
//     value8: types.string({ normalize: ['trimmed', 'uppercased'] }),
//   });

//   expect(
//     ObjString({
//       value1: 'Some Text',
//       value2: 'Some Text',
//       value3: '  some text   ',
//       value4: 'some text here',
//       value5: 'some text here',
//       value6: 'SOME TEXT HERE',
//       value7: 'SOME TEXT HERE',
//       value8: ' some text here  ',
//     }),
//   ).toEqual({
//     value1: 'SOME TEXT',
//     value2: 'some text',
//     value3: 'some text',
//     value4: 'Some text here',
//     value5: 'Some Text Here',
//     value6: 'sOME TEXT HERE',
//     value7: 'sOME tEXT hERE',
//     value8: 'SOME TEXT HERE',
//   });
// });
