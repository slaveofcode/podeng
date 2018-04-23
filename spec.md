# Oh My JS

## DataTypes

- follow jkt
- function for custom / predefined value

## Components

- JS Component (Object & Array)
- Enum

## Features

- Define parser component
- Various Types
- Key-Value Map
- Extended
- Extended with Modify parent
- Check instance of component
- Multi-level parser
- Valid value based on ENUM
- Configurable component validator (default is active)
- immutable results
- custom value mapping

## Blueprint

const ohmyjs = require('ohmyjs');

const types = ohmyjs.types;

const item = ohmyjs.object({
  categoryName: types.string,
  categoryId: types.number,
  someSecretKey: types.string({ serializeTo: 'someKey' }) // instant key parser
}, {
  throw: {
    onKey: (key, value) => throw new Error(`Error on key ${key} with value ${value}`),
    onAll: (key, value, allParams) => throw new Error(`Error on key ${key} with value ${value}and all params ${allParams}`),
  }
})

const itemParser = ohmyjs.serializer(item, {
  categoryName: 'category',
  categoryId: 'id'
})

item({ data }) // data without serialization
item.serialize({ data }) // data with serialization
item.deserialize({ })

const itemArray = ohmyjs.array(item)

const Person = ohmyjs.object({
    id: ohmyjs.number,
    name: ohmyjs.string,
    hobby: ohmyjs.array(ohmyjs.string),
    someComplexArray: ohmyjs.array({ id: ohmyjs.number, name: ohmyjs.string }),
    arrayItemOfObj: ohmyjs.array(item),
    arrayItems: itemArray
}, {
  warning: true, // warning on wrong value given
  throw: true, // throw error on wrong value given
})

const Mutant = ohmyjs.extends(Person, {
  breathOnWater: ohmyjs.bool,
  ability: ohmyjs.constant(['Fly', 'Run Faster', 'Jump High'])
}, {
  delete: ['arrayItems', 'someComplexArray']
})


all object must be deep frozen through Object.freeze({}) recursively