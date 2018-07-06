# PodengJS

Simple JSON value normalization to make everything gone right.

This small library helps you to make JSON property value to follow the rules, no matter how strange the value is, you could still normalize it into right type(s).

<img src="https://raw.github.com/slaveofcode/podeng/master/logos/logo_200.png" align="right" />

## Core Concepts
1. **Normalization**, normalize json value to follow rules
2. **Serialization**, normalization-like but with different key name
3. **Deserialization**, reversed-like-serialization also with different key name
4. **Validation**, validate json value if not matched with rules

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

## Supported types and options

> Default Options (available for all types)

- **hideOnFail**: Hide the value when normalization failed, default: `false`
- **default**: The default value to assign when normalization fails, default: `null`
- **validate**: Custom validation function, should return boolean, `true` for valid, `false` for invalid, default is `null`
- **serialize.to**: Serialization options to rename property name on serializing, default: `null`
- **serialize.display**: Serialization options to hide property name on serializing, default: `true`
- **deserialize.from**: Deserialization options to accept property name on deserializing, default: `null`
- **deserialize.display**: Deserialization options to hide property name on deserializing, default: `true`

| Type        | Default Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `string`    | **stringify**: every value will be stringified, default: `true` <br>**min**: minimum digits to accept, default: `null`<br>**max**: maximum digits to accept, default: `null`<br>**normalize**: normalize the string value, the valid options are:<br><ul><li>`trimmed`: Trimming space of the value</li><li>`uppercased`: make all characters upper</li><li>`lowercased`: make all characters lower</li><li>`upper_first`: make first character upper</li><li>`upper_first_word`: make first part or word in string to upper</li><li>`lower_first`: make first character lower</li><li>`lower_first_word`: make first part of word in string to lower</li></ul> | String data types                                                                                                                                                                                                                                                                                                                                                                                                          |
| `number`    | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit number value to accept, not include the length behind of comma separated number, default: `null`<br>**maxDigits**: maximum digit number value to accept, not include the length behind of comma separated number, default: `null`                                                                                                                                                                                                                                                                          | Number data types including float and integer                                                                                                                                                                                                                                                                                                                                                                              |
| `integer`   | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit value to accept, default: `null`<br>**maxDigits**: maximum digit value to accept, default: `null`                                                                                                                                                                                                                                                                                                                                                                                                          | Accept integer data type                                                                                                                                                                                                                                                                                                                                                                                                   |
| `float`     | **min**: minimum number value to accept, default: `null`<br>**max**: maximum number value to accept, default: `null`<br>**minDigits**: minimal digit value to accept, not include the length after comma separated, default: `null`<br>**maxDigits**: maximum digit value to accept, not include the length after comma separated, default: `null`                                                                                                                                                                                                                                                                                                              | Accept float data type                                                                                                                                                                                                                                                                                                                                                                                                     |
| `boolean`   | **validList**: array list of valid values, default: `null`<br>**invalidList**: array list of invalid values, default: `null`<br>**caseSensitive**: case sensitive status to match with **validList** or **invalidList**, this works if any string value exist on these options, default: `null`<br>**normalizeNil**: change every non `undefined` or null value to normalize as a `true` value, default: `null`                                                                                                                                                                                                                                                 | In boolean data type, you should only choose either `validList` or `invalidList` to set on the options, they can't be used together (if both are setup, `validList` will be used). If you set `validList`, every value listed on `validList` array will make the result value become `true`, otherwise for every value described on `invalidList` array, every value that not listed on `invalidList` would become `true`. |
| `datetime`  | **parseFormat**: string format to parse or accept incoming value, default: `null`<br>**returnFormat**: string format to parse value on before its returned, default: `null`<br>**timezoneAware**: boolean that indicates to parse with current timezone or not, default: `true`<br>**asMoment**: boolean that indicates to returning as a `moment` object, default: `false`<br>**dateOnly**: only accept and return date format as `YYYY-MM-DD`, default: `false`<br>**timeOnly**: only accept and return time format as `HH:mm:ss`, default: `false`                                                                                                           | Datetime type could be used for date or time implementation, they can be resulted as a moment object automatically                                                                                                                                                                                                                                                                                                         |
| `any`       | no options except on default options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | All values will be accepted                                                                                                                                                                                                                                                                                                                                                                                                |
| `options`   | **list**: array of valid values, or can be set directly as a type argument                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Only value inside this list will evaluated as a valid value                                                                                                                                                                                                                                                                                                                                                                |
| `transform` | no options except on default options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | transform accept function to evaluates the incoming value as a valid or invalid value, the function should return `boolean` type of status                                                                                                                                                                                                                                                                                 |
