# PodengJS

Simple JSON value normalization to make everything gone right.

This small library helps you to make JSON property value to follow the rules, no matter how strange the value is, you could still normalize it into right type(s).

**Update:** I have a limited amount of time to writing documentation on this module, for faster understanding (and example) please take a look at test files under [**test**](https://github.com/slaveofcode/podeng/tree/master/test) folder, it has a lot of code examples to get you understand the idea of this module.

<img src="https://raw.github.com/slaveofcode/podeng/master/logos/logo_200.png" align="right" />

## Terms
1. **Normalization**, convert json value to follow rules without changing any key/property name
2. **Serialization**, normalization-like but with different key name
3. **Deserialization**, reversed-like-serialization but with the different supplied key/property name 
4. **Validation**, validate json value if not matched with rules(also could work with serialization-deserialization)

## Example Cases

1. Parser-Serializer for your RESTful API
2. JSON value validator
3. JSON value normalization
4. Minimalist JSON Schema
5. Other...

## Installation

Podeng requires a minimal node version >= 6.x

> NPM   
```
npm i podeng
```

> Yarn
```
yarn add podeng
```

## Known Dependencies
- lodash
- moment
- moment-timezone (for running test)
- jest (for running test)

## Running the Test

```
>> npm i
>> npm run test
```

## Documentation

### Simple Example

```
    const { blueprint, types } = require('podeng')

    const PersonSchema = blueprint.object({
      name: types.string,
      age: types.integer,
      birthday: types.datetime({ dateOnly: true }) // ISO 8601
    })

    const givenData = {
      name: 'Aditya Kresna',
      age: '27',
      birthday: '1991-06-18 00:05:00',
      address: 'Indonesia',
      hobby: ['Sleeping', 'Coding']
    }

    const result = PersonSchema(givenData)
    // {
    //   name: 'Aditya Kresna',
    //   age: 27,
    //   birthday: '1991-06-18'
    // }
```

## Blueprint Object Options

- **frozen**: Freeze the JSON result, so it cannot be modified
- **giveWarning**: Enable warning when parsing (normalize-serialize-deserialize) got invalid value
- **onError**: Object to determine action when error caught on parsing, this has 2 option handler, `onKey` and `onAll`
   - **onKey**: A function to execute while some key detected has an invalid value, this function will 2 supplied by parameter key of type and error details 
   - **onAll**: A function to execute when all key detected has an invalid value, this function just supplied with one parameter, the error details
- **throwOnError**: Throwing an exception while the error parse detected
- **allowUnknownProperties**: This option will allow unknown properties on parsing

> Blueprint Object Example

```
const Parser = blueprint.object(
  {
    key: types.bool,
    key2: types.bool(['Yes', 'True', 'Yup'])
  },
  {
    throwOnError: true,
    giveWarning: true
  }
);

const Parser2 = blueprint.object(
  {
    value: types.integer
  },
  { onError: TypeError('The Invalid onError value') }
)

const Parser3 = blueprint.array(
  {
    value: types.integer
  },
  {
    onError: {
      onKey: (key, err) => {
        throw new TypeError('Error coming from ', key)
      },
    },
  }
)

// Create array object from JSON
const ListParser = blueprint.array({
  name: types.string,
  age: types.integer
})

// Create array object from existing blueprint object
const Person = blueprint.object({
  name: types.string
});

const People = blueprint.array(Person);
```

## Blueprint Extend

Once you make an Object of blueprint, it can be extended into some new object with different types. This method helps you easier to re-use an existing object or defining several object with same basic types.

> Example Of Blueprint Extend

```
const { blueprint, types, BlueprintClass } = require('podeng');

const Car = blueprint.object({
  color: types.string,
  wheels: types.string({ normalize: ['trimmed', 'upper_first'] })
});

const Bus = blueprint.extend(Car, {
  brand: types.string({ normalize: 'upper_first_word' }),
  length: types.transform(val => `${val} meters`)
});

const Buses = blueprint.array(Bus);

// extend from an array object
const FlyingBuses = blueprint.extend(Buses, {
  wingsCount: typoes.integer
});

Bus({
  color: 'Blue',
  wheels: 'bridgestone',
  brand: 'mercedes benz',
  length: 20
})

//{
//  color: 'Blue',
//  wheels: 'Bridgestone',
//  brand: 'Mercedes Benz',
//  length: '20 meters'
//}

FlyingBuses([{
  color: 'Blue',
  wheels: 'bridgestone',
  brand: 'mercedes benz',
  length: 20,
  wingsCount: 20
}])

//[{
//  color: 'Blue',
//  wheels: 'Bridgestone',
//  brand: 'Mercedes Benz',
//  length: '20 meters'
//  wingsCount: 20
//}]
```

Even you could attach some options like a normal blueprint object

```
const Man = blueprint.object({
  name: types.string,
  age: types.integer,
  birthday: types.datetime({ dateOnly: true })
});

const Child = blueprint.extend(
  Man,
  {
    toy: types.string
  },
  {
    onError: new TypeError('Ooops you\'ve got an wrong value!')
  }
);
```

Or you could remove properties that not needed on extended object by giving them an extra argument

```
const Man = blueprint.object({
  name: types.string,
  age: types.integer,
  birthday: types.datetime({ dateOnly: true })
});

const Alien = blueprint.extend(Man, {
  planet: types.string
}, {
  deleteProperties: ['birthday']
})

```

## Embedding Blueprint Object

In Podeng attaching an existing blueprint object to property is possible, it known as embedding object. On embed object, all the rules of blueprint object will be assigned to the related property in master object.

>> Example Embedded Object

```
const Obj1 = blueprint.object({
  myValue: types.integer
})

const Obj2 = blueprint.object({
  foo: types.string,
  bar: Obj1
})

const Obj3 = blueprint.object({
  foo: types.string,
  bar: Obj1.embed({ default: 'empty value' })
})

Obj2({foo: 'bar', bar: { myValue: 'foo' }}) // { "foo": "bar", "bar": { "myValue": "foo" }}

Obj3({ foo: 'something', bar: { myValue: 'interesting' }}) // { "foo": "something", "bar": { "myValue": "interesting" }}

Obj3({ foo: 'something' }) // { "foo": "something", "bar": "empty value"}

```

## Types options

> Default Options (available for all types)

- **hideOnFail**: Hide the value when normalization failed, default: `false`
- **default**: The default value to assign when normalization fails, default: `null`
- **validate**: Custom validation function, should return boolean, `true` for valid, `false` for invalid, default is `null`
- **serialize.to**: Serialization options to rename property name on serializing, default: `null`
- **serialize.display**: Serialization options to hide property name on serializing, default: `true`
- **deserialize.from**: Deserialization options to accept property name on deserializing, default: `null`
- **deserialize.display**: Deserialization options to hide property name on deserializing, default: `true`

| Type         | Default Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `string`     | **stringify**: every value will be stringified, default: `true` <br>**min**: minimum digits to accept, default: `null`<br>**max**: maximum digits to accept, default: `null`<br>**normalize**: normalize the string value, the valid options are:<br><ul><li>`trimmed`: Trimming space of the value</li><li>`uppercased`: make all characters upper</li><li>`lowercased`: make all characters lower</li><li>`upper_first`: make first character upper</li><li>`upper_first_word`: make first part or word in string to upper</li><li>`lower_first`: make first character lower</li><li>`lower_first_word`: make first part of word in string to lower</li></ul> | String data types                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `number`     | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit number value to accept, not include the length behind of comma separated number, default: `null`<br>**maxDigits**: maximum digit number value to accept, not include the length behind of comma separated number, default: `null`                                                                                                                                                                                                                                                                          | Number data types including float and integer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `integer`    | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit value to accept, default: `null`<br>**maxDigits**: maximum digit value to accept, default: `null`                                                                                                                                                                                                                                                                                                                                                                                                          | Accept integer data type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `float`      | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit value to accept, not include the length after comma separated, default: `null`<br>**maxDigits**: maximum digit value to accept, not include the length after comma separated, default: `null`                                                                                                                                                                                                                                                                                                              | Accept float data type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `bool`    | **validList**: array list of valid values, default: `null`<br>**invalidList**: array list of invalid values, default: `null`<br>**caseSensitive**: case sensitive status to match with **validList** or **invalidList**, this works if any string value exist on these options, default: `null`<br>**normalizeNil**: change every non `undefined` or null value to normalize as a `true` value, default: `null`                                                                                                                                                                                                                                                 | In boolean data type, you should only choose either `validList` or `invalidList` to set on the options, they can't be used together (if both are setup, `validList` will be used). If you set `validList`, every value listed on `validList` array will make the result value become `true`, otherwise for every value described on `invalidList` array, every value that not listed on `invalidList` would become `true`. Please take a note for *normalizeNil* option doesn't effect if has `validList` or `invalidList` option |
| `datetime`   | **parseFormat**: string format to parse or accept incoming value, default: `null`<br>**returnFormat**: string format to parse value on before its returned, default: `null`<br>**timezoneAware**: boolean that indicates to parse with current timezone or not, default: `true`<br>**asMoment**: boolean that indicates to returning as a `moment` object, default: `false`<br>**dateOnly**: only accept and return date format as `YYYY-MM-DD`, default: `false`<br>**timeOnly**: only accept and return time format as `HH:mm:ss`, default: `false`                                                                                                           | Datetime type could be used for date or time implementation, they can be resulted as a moment object automatically                                                                                                                                                                                                                                                                                                                                                                                                                |
| `any`        | no options except on default options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | All values will be accepted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `options`    | **list**: array of valid values, or can be set directly as a type argument                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Only value inside this list will evaluated as a valid value                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `transform`  | no options except on default options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | transform accept function to evaluates the incoming value as a valid or invalid value, the function should return `boolean` type of status                                                                                                                                                                                                                                                                                                                                                                                        |
| `conditions` | **evaluates**: a function that evaluates the input value, must return `boolean` type indicating the success status<br>**onOk**: a function to run if the evaulation status is true<br>**onFail**: a function to run if the evaulation status is false                                                                                                                                                                                                                                                                                                                                                                                                           | Condition could be helpful if we want to accept value based on several conditions<br>**shorthand**: use first argument as **evaluates** function, second argument as **onOk** and third as **onFail** function.                                                                                                                                                                                                                                                                                                                   |


## Types with Simple Example

These are various types that you can use to normalize JSON values, please take a note the example just a simple schema that may not covering all of the options described above, but you can explore more deeper inspecting the test files or by opening an issue here. 

### String

```
const Parser = blueprint.object({
  name: types.string({ normalize: ['trimmed', 'upper_first_word']),
  address: types.string({ normalize: 'trimmed'),
})

Parser({
  name: ' aditya kresna permana  ',
  address: '  Bekasi Indonesia '
})

// produce { "name": 'Aditya Kresna Permana', address: 'Bekasi Indonesia' }
```


### Integer

```
const Parser = blueprint.object({
  num: types.integer({ min: 10 })
})

Parser({ num: 10 }) // { "num": 10 }
Parser({ num: 7 }) // { "num": null }

```

### Float

```
const Parser = blueprint.object({
  num: types.float({ min: 10 })
})

Parser({ num: 10.10 }) // { "num": 10.10 }
Parser({ num: 7.12 }) // { "num": null }

```

### Number

```
const Parser = blueprint.object({
  num: types.number,
  num2: types.number
})

Parser({ num: 11.10, num2: 20 }) // { "num": 11.10, "num2": 20 }
Parser({ num: 7, num2: 18.5 }) // { "num": 7, "num2": 18.5 }

```

### Boolean

```
const Parser = blueprint.object({
  val1: types.bool,
  val2: types.bool(['Yes', 'Yeah']),
})

Parser({ val1: true, val2: 'Yes' })) // { "val1": true, "val2": true }
Parser({ val1: true, val2: 'No' })) // { "val1": true, "val2": false }
```

### DateTime

```
const Parser = blueprint.object({
  val1: types.datetime,
  val2: types.datetime('DD-MM-YYYY'),
})


Parser({ val1: '2018-06-18', val2: '18-06-1991' }) // { "val1": "2018-06-18T00:00:00+07:00", "val2": "1991-06-18T00:00:00+07:00" }
```

### Options

```
const Car = blueprint.object({
  brand: types.options(['Honda', 'Toyota', 'Mitsubishi']),
  color: types.options({ list: ['Red', 'Green', 'Blue'], default: 'None' }),
})

Car({ brand: 'Yamaha', color: 'Green' }) // { "brand": null, "color": "Green" }
Car({ brand: 'Yamaha', color: 'Black' }) // { "brand": null, "color": "None" }
```

### Transform

```
const Parser = blueprint.object({
  val1: types.transform(val => val * 2),
  val2: types.transform(1818),
})

Parser({ val1: 10, val2: 20 }) // { "val1": 20, "val2": 1818 }
```

### Conditions

```
const Exercise = blueprint.object({
  age: types.conditions(value => value >= 17, 'Adult', 'Child'),
  grade: types.conditions({
    evaluates: grade => grade >= 7,
    onOk: 'Congratulation!',
    onFail: 'Sorry You Fail',
  }),
})

Exercise({ age: 17, grade: 8 }) // { "age": "Adult", "grade": "Congratulation!" }
Exercise({ age: 10, grade: 5 }) // { "age": "Child", "grade": "Sorry You Fail" }
```

### Any

```
const Parser = blueprint.object({
  val1: types.any,
  val2: types.any(),
  val3: types.any({ allowUndefined: true })
})

Parser({ val1: 123, val2: "Foo", val3: null }) // { "val1": 123, "val2": "Foo", "val3": null }
Parser({ val1: "Foo", val2: "Bar" }) // { "val1": 123, "val2": "Foo", "val3": undefined }
Parser({ val1: "Foo"}) // { "val1": 123, "val2": null, "val3": undefined }
```

## Validator

Podeng has capability to validate your json, the validation refers to your type schema and throwing exception (or not) depending on what the options you set. If you find more example to implement validation, you could refers to test files as well.

### Example Validation

```
const { blueprint, types, validator } = require('podeng');

const Human = blueprint.object({
  eyeColor: types.string,
  hairColor: types.string
});

const HumanValidator = validator(Human);

HumanValidator.validate({ eyeColor: 'Blue', hairColor: () => {} }); // will throw an error

const [errorStatus, errorDetails] = HumanValidator.check({
  eyeColor: 'Blue',
  hairColor: () => {}
});

// errorStatus: true
// errorDetails: { hairColor: ['failed to parse "hairColor" with its type'] }
```

## License

MIT License

Copyright 2018 Aditya Kresna Permana

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
