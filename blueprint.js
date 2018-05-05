// Parser
const { blueprint, types, faker, validator } = require('podeng');

// Type properties
// - String: min, max, translate: [uppercased, lowercased, upper_first, upper_first_word, custom func]

// Creating blueprint of object
const Item = blueprint.object({
  categoryName: types.string,
  categoryId: types.number,
  someSecretKey: types.string
}, {
  throwOnError: {
    onKey: (key, value) => { throw new Error(`Error on key ${key} with value ${value}`) },
    onAll: (key, value, allParams) => { throw new Error(`Error on key ${key} with value ${value}and all params ${allParams}`) },
  }
});

// Creating serializer from 
const parsedItem = Item({
  categoryName: 'cars',
  categoryId: '1'
});

// Creating blueprint of array of object
const Items = blueprint.array(Item)

const parsedItems = Items([
  {
    categoryName: 'cars',
    categoryId: '1'
  },
  {
    categoryName: 'colors',
    categoryId: '2'
  }
])

// Creating more complex blueprint object
const Person = blueprint.object(
  {
    id: type.number,
    name: type.string({ min: 4, max: 50, translate: 'upper_first_word' }, { default: 'No Names' }),
    hobby: type.array(type.string),
    someComplexArray: type.array({ id: type.number, name: type.string }, { default: null }),
    arrayItemOfObj: type.array(Item, { default: [] }),
    arrayItems: Items
  },
  {
    giveWarning: true, // warning on wrong value given
    throwOnError: true // throw error on wrong value given
  }
);

// Creating fake data
const fakePerson = faker.faking(Person);
const fakeItems = faker.faking(Items);

// Extending Blueprint object
const Mutant = blueprint.extend(Person, {
  breathOnWater: type.bool,
  ability: type.constant(['Fly', 'Run Faster', 'Jump High'])
}, {
  giveWarning: false,
  throwOnError: false
}, {
  deleteProperties: ['id', 'hobby']
});

// validating with existing blueprint object
const [ isError, errorDetails ] = validator(Mutant).check({ breathOnWater: 'Not valid value' }) // return status of validation, not throwing error
validator(Mutant).validate({ breathOnWater: 'Not valid value' }) // throw an error

// keyMutation example
const FooBar = blueprint.object({
  id: type.integer({ serialize: { display: false } }),
  thing: type.string({ serialize: { to: 'something' } }),

});

const foo = FooBar({ id: '343', thing: 'boooo laaa' }); // { id: 343, thing: 'boooo laaa' }
const fooMutated = FooBar.serialize({ id: '343', thing: 'boooo laaa' }) // { something: 'boooo laaa' }
const fooFromMutated = FooBar.deserialize({ something: 'boooo laaa' }) // { thing: 'boooo laaa' }