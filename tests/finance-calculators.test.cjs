const assert = require('node:assert/strict');
const test = require('node:test');
const { calculate } = require('../assets/js/finance-calculators.js');

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.0001, `${actual} !== ${expected}`);

test('monthly deposits use month-end timing and preserve zero-return arithmetic', () => {
  const result = calculate('growth', { initial: 100000, monthly: 2000, years: 2, rate: 0 });
  close(result[0][1], 148000);
  close(result[1][1], 148000);
  close(result[2][1], 0);
});

test('annual 12% return compounds to 12% over 12 months', () => {
  close(calculate('growth', { initial: 100000, monthly: 0, years: 1, rate: 12 })[0][1], 112000);
});

test('goal calculator inverts monthly deposits at zero return', () => {
  close(calculate('goal', { initial: 100000, target: 220000, years: 1, rate: 0 })[0][1], 10000);
});

test('weighted cost and three-way rebalance use quantities and target weights', () => {
  close(calculate('average', { q1: 10, p1: 100, q2: 5, p2: 130 })[0][1], 110);
  const result = calculate('rebalance', { a: 70000, b: 20000, c: 10000, ta: 60, tb: 25, tc: 15 });
  assert.deepEqual(result.map(([, value]) => value), [100000, -10000, 5000, 5000]);
  assert.throws(() => calculate('rebalance', { a: 1, b: 1, c: 1, ta: 60, tb: 20, tc: 10 }), /sum/);
});

test('FIFO consumes older lots first and rejects overselling', () => {
  const p = { q1: 5, p1: 100, q2: 4, p2: 120, q3: 3, p3: 130, sell: 7, salePrice: 150 };
  assert.deepEqual(calculate('fifo', p).map(([, value]) => value), [740, 1050, 310, 5]);
  assert.throws(() => calculate('fifo', { ...p, sell: 13 }), /sell/);
});

test('manual FX and percentage decline use entered values', () => {
  close(calculate('fx', { foreign: 100, rate: 24.5 })[0][1], 2450);
  assert.deepEqual(calculate('stress', { value: 100000, drop: 40 }).map(([, value]) => value), [60000, 40000]);
});
