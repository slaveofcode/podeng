# PodengJS

Simple JSON value normalization to make everything gone right.

This small library helps you to make JSON property value to follow the rules, no matter how strange the value is, you could still normalize it into right type(s).

<img src="https://raw.github.com/slaveofcode/podeng/master/logos/logo_200.png" align="right" />

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

| Type          | Default Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Description                                                                                        |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **ALL Types** | **hideOnFail**: Hide the value when normalization failed, default: `false`<br>**default**: The default value to assign when normalization fails, default: `null`<br>**validate**: Custom validation function, should return boolean, `true` for valid, `false` for invalid, default is `null`<br>**serialize.to**: Serialization options to rename property name on serializing, default: `null`<br>**serialize.display**: Serialization options to hide property name on serializing, default: `true`<br>**deserialize.from**: Deserialization options to accept property name on deserializing, default: `null`<br>**deserialize.display**: Deserialization options to hide property name on deserializing, default: `true`<br> | These options are available on every types described below here                                    |
| `string`      | **stringify**: every value will be stringified, default: `true` <br>**min**: minimum digits to accept, default: `null`<br>**max**: maximum digits to accept, default: `null`<br>**normalize**: normalize the string value, the valid options are:<br><ul><li>`trimmed`: Trimming space of the value</li><li>`uppercased`: make all characters upper</li><li>`lowercased`: make all characters lower</li><li>`upper_first`: make first character upper</li><li>`upper_first_word`: make first part or word in string to upper</li><li>`lower_first`: make first character lower                                                                                                                                                    | String data types</li><li>`lower_first_word`: make first part of word in string to lower</li></ul> |
