/* eslint-disable */
/**
 * This file intended to create a blueprint or feature plan in this project
 * this also could be used for code documentation about how to use the lib.
 */

// Parser
const { blueprint, types, faker, validator } = require('podeng')

// Type properties
// - String: min, max, normalize: [uppercased, lowercased, upper_first, upper_first_word, custom func]

// Creating blueprint of object
const Item = blueprint.object(
  {
    categoryName: types.string,
    categoryId: types.number,
    someSecretKey: types.string,
  },
  {
    onError: {
      onKey: (key, value) => {
        throw new Error(`Error on key ${key} with value ${value}`)
      },
      onAll: allErrorParams => {
        throw new Error(
          `Error on key ${key} with value ${value}and all params ${allParams}`
        )
      },
    },
  }
)

// Creating serializer from
const parsedItem = Item({
  categoryName: 'cars',
  categoryId: '1',
})

// Creating blueprint of array of object
const Items = blueprint.array(Item)

// Creating blueprint of array of plain object
const Color = blueprint.object({ name: types.string })
const Cars = blueprint.array({
  type: types.string,
  brand: types.options({ list: ['Honda', 'Toyota', 'Ford'] }), // options could be a primitive types, blueprint object (not array), with single or multiple (array) values
  variant: types.options([Color, Item]),
  color: types.options(Color),
})

const parsedItems = Items([
  {
    categoryName: 'cars',
    categoryId: '1',
  },
  {
    categoryName: 'colors',
    categoryId: '2',
  },
])

// Creating more complex blueprint object
const Person = blueprint.object(
  {
    id: types.number,
    name: types.string({
      min: 4,
      max: 50,
      normalize: 'upper_first_word',
      default: 'No Names',
    }),
    phone: types.ext.phone,
    credit_card: types.ext.credit_card,
    hobby: types.array(types.string),
    someComplexArray: types.array({
      id: types.number,
      name: types.string,
      default: null,
    }),
    arrayItemOfObj: types.array(Item, { default: [] }),
    arrayItems: Items,
  },
  {
    frozen: true, // Freeze the returned object
    giveWarning: true, // warning on wrong value given
    throwOnError: true, // throw error on wrong value given
    allowUnknownProperties: false, // no unknow properties given will exist if false
  }
)

// Condition types
const spicyEvaluator = food => {
  const foodEvaluator = {
    'gado-gado': true,
    pizza: true,
    steak: false,
    tomyum: true,
  }

  return foodEvaluator[food]
}

// Boolean types
const Food = blueprint.object({
  isSpicy: types.bool,
  isMealFood: types.bool(['Yes', 'Ya', 'Sure']),
  isDinnerFood: types.bool(['Yes', 'Sure'], ['No', 'Not']),
  isAsianFood: types.bool({
    validList: ['Yes', 'Ya', 'Sure'],
    invalidList: ['No', 'Nope', 'Not'],
  }),
})

const asianFoodEvaluator = (food, evaluatedValue) => {
  const asianFoodEvaluator = {
    'gado-gado': true,
    pizza: false,
    steak: false,
    tomyum: true,
  }

  return evaluatedValue && asianFoodEvaluator[food]
}

const Food = blueprint.object({
  name: types.string({ hideOnFail: true }),
  isSpicy: types.conditions({
    evaluates: foodEvaluator,
    onOk: 'Yes',
    onFail: 'No',
  }),
  isSpicyShorthand: types.conditions(foodEvaluator, 'Yes', 'No'),
  isSpicyAndFromAsian: types.conditions({
    evaluates: [foodEvaluator, asianFoodEvaluator],
    onOk: 'Yes',
    onFail: 'No',
  }),
  isFoodIsSpicyAndFromAsian: types.conditions({
    evaluates: foodEvaluator,
    onOk: types.conditions({
      evaluates: asianFoodEvaluator,
      onOk: 'True Asian Spicy Food',
      onFail: 'No',
    }),
    onFail: 'No',
  }),
})

// Creating fake data
const fakePerson = faker.faking(Person)
const fakeItems = faker.faking(Items)

// Extending Blueprint object, same property on extend will override parent property
const Mutant = blueprint.extend(
  Person,
  {
    breathOnWater: types.bool,
    ability: types.options(['Fly', 'Run Faster', 'Jump High']),
  },
  {
    giveWarning: false,
    throwOnError: false,
  },
  {
    deleteProperties: ['id', 'hobby'],
  }
)

// validating with existing blueprint object
const [isError, errorDetails] = validator(Mutant, {
  allowUnknownProperties: true,
}).check({
  breathOnWater: 'Not valid value',
}) // return status of validation, not throwing error
validator(Mutant, { allowUnknownProperties: true }).validate({
  breathOnWater: 'Not valid value',
}) // throw an error

// keyMutation example
const FooBar = blueprint.object({
  id: types.integer({ serialize: { display: false } }),
  thing: types.string({ serialize: { to: 'something' } }),
})

const foo = FooBar({ id: '343', thing: 'boooo laaa' }) // { id: 343, thing: 'boooo laaa' }
const fooMutated = FooBar.serialize({ id: '343', thing: 'boooo laaa' }) // { something: 'boooo laaa' }
const fooFromMutated = FooBar.deserialize({ something: 'boooo laaa' }) // { thing: 'boooo laaa' }
