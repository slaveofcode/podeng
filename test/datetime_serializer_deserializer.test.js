'use strict';

const moment = require('moment-timezone');
const blueprint = require('../blueprint');
const types = require('../types');

moment.tz.setDefault('Asia/Jakarta');

test('Object able to serialize and deserialize', () => {
  const Obj1 = blueprint.object({
    date: types.datetime({ serialize: { to: 'happy_date' } })
  });

  expect(Obj1.serialize({ date: '1991-06-18' })).toEqual({
    happy_date: '1991-06-18T00:00:00+07:00'
  });
  expect(Obj1.deserialize({ happy_date: '1991-06-18' })).toEqual({
    date: '1991-06-18T00:00:00+07:00'
  });
  expect(Obj1.deserialize({ happy_date: '1991-06-18s' })).toEqual({
    date: null
  });
});

test('Object able to serialize and deserialize with custom deserialize rules', () => {
  const Obj1 = blueprint.object({
    date: types.datetime({
      serialize: { to: 'happy_date' },
      deserialize: { from: 'what_a_date' },
      timezoneAware: false
    })
  });

  const Obj2 = blueprint.object({
    date: types.datetime({
      dateOnly: true,
      serialize: { to: 'good_day' }
    })
  });

  const Obj3 = blueprint.object({
    date: types.datetime({
      returnFormat: 'DD-MM-YYYY HH'
    })
  });

  expect(Obj1.serialize({ date: '1991-06-18' })).toEqual({
    happy_date: '1991-06-18T00:00:00Z'
  });
  expect(Obj1.serialize({ date: '1991-06-17s' })).toEqual({ happy_date: null });
  expect(Obj1.deserialize({ what_a_date: '1991-06-07' })).toEqual({
    date: '1991-06-07T00:00:00Z'
  });
  expect(Obj1.deserialize({ what_a_date: 'meh' })).toEqual({
    date: null
  });
  expect(Obj1.deserialize({ what_a_date: '1991-06-18 18:08:08' })).toEqual({
    date: '1991-06-18T18:08:08Z'
  });

  expect(Obj2.serialize({ date: '1992-05-31 18:08:31' })).toEqual({
    good_day: '1992-05-31'
  });
  expect(Obj2.serialize({ date: 'meh' })).toEqual({ good_day: null });
  expect(Obj2.serialize({ date: '1992-05-31' })).toEqual({
    good_day: '1992-05-31'
  });

  expect(Obj2.deserialize({ good_day: '1992-05-31' })).toEqual({
    date: '1992-05-31'
  });
  expect(Obj2.deserialize({ good_day: '1992-xx-05-31' })).toEqual({
    date: null
  });
  expect(Obj2.deserialize({ good_day: '1992-05-31 18:08:31' })).toEqual({
    date: '1992-05-31'
  });

  expect(Obj3.serialize({ date: '1991-06-18' })).toEqual({
    date: '18-06-1991 00'
  });
  expect(Obj3.serialize({ date: '1992-05-31 18:08:31' })).toEqual({
    date: '31-05-1992 18'
  });
  expect(Obj3.serialize({ date: '1992-05-3111' })).toEqual({ date: null });

  expect(Obj3.deserialize({ date: '1991-06-18' })).toEqual({
    date: '18-06-1991 00'
  });
  expect(Obj3.deserialize({ date: '1992-05-31 18:08:31' })).toEqual({
    date: '31-05-1992 18'
  });
  expect(Obj3.deserialize({ date: '1992-05-3111' })).toEqual({ date: null });
});

test('Object able to hide on serialize', () => {
  const Obj1 = blueprint.object({
    date: types.datetime({
      serialize: { to: 'good_day' }
    }),
    date2: types.datetime({ serialize: { display: false } })
  });

  expect(Obj1.serialize({ date: '1991-06-18', date2: '1991-06-18' })).toEqual({
    good_day: '1991-06-18T00:00:00+07:00'
  });
  expect(Obj1.serialize({ date: '1991x-06-18', date2: '1991-06-18' })).toEqual({
    good_day: null
  });
  expect(Obj1({ date: '1991-06-18', date2: '1991-06-18' })).toEqual({
    date: '1991-06-18T00:00:00+07:00',
    date2: '1991-06-18T00:00:00+07:00'
  });
});
