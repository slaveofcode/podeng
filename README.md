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

| Type     | Default Options                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Description       |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `string` | **stringify**: every value will be stringified, default: `true` <br>**min**: minimum digits to accept, default: `null`<br>**max**: maximum digits to accept, default: `null`<br>**normalize**: normalize the string value, the valid options are:<br><ol><li>aaa</li></ol>`trimmed`: Trimming space of the value<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`uppercased`: make all characters upper<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lowercased`: make all characters lower<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`upper_first`: make first character upper<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`upper_first_word`: make first part or word in string to upper<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lower_first` | String data types |
