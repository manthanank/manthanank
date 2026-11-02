const { test } = require('node:test');
const assert = require('node:assert/strict');
const { toPublicStats } = require('../scripts/update-stats');

test('keeps only the language fields the site shows', () => {
  const raw = {
    data: {
      start: '2026-01-01T00:00:00Z',
      end: '2026-01-07T23:59:59Z',
      range: 'last_7_days',
      human_readable_total: '2 hrs 5 mins',
      projects: [{ name: 'private-project' }],
      machines: [{ name: 'my-laptop' }],
      languages: [
        {
          name: 'JavaScript',
          percent: 80,
          text: '1 hr 40 mins',
          total_seconds: 6000,
          hours: 1,
          minutes: 40,
          digital: '1:40',
        },
      ],
    },
  };

  assert.deepEqual(toPublicStats(raw), {
    data: {
      start: '2026-01-01T00:00:00Z',
      end: '2026-01-07T23:59:59Z',
      range: 'last_7_days',
      human_readable_total: '2 hrs 5 mins',
      languages: [{ name: 'JavaScript', percent: 80, text: '1 hr 40 mins', total_seconds: 6000 }],
    },
  });
});

test('returns an empty language list for missing data', () => {
  assert.deepEqual(toPublicStats(undefined).data.languages, []);
  assert.deepEqual(toPublicStats({}).data.languages, []);
});
