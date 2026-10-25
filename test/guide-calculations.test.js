import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudyPlan } from '../guide-calculations.js';

const example = { minutes: 180, speed: 1.5, days: 3, dailyMinutes: 30, reviewPercent: 0 };

test('published lecture examples distinguish viewing and review time', () => {
  assert.deepEqual(calculateStudyPlan(example), {
    viewingMinutes: 120, requiredMinutes: 120, capacityMinutes: 90,
    dailyTargetMinutes: 40, balanceMinutes: -30
  });
  assert.deepEqual(calculateStudyPlan({ ...example, reviewPercent: 25 }), {
    viewingMinutes: 120, requiredMinutes: 150, capacityMinutes: 90,
    dailyTargetMinutes: 50, balanceMinutes: -60
  });
});

test('plans preserve fractional minutes and distinguish spare time from exact capacity', () => {
  assert.equal(calculateStudyPlan({ ...example, dailyMinutes: 40 }).balanceMinutes, 0);
  assert.equal(calculateStudyPlan({ ...example, dailyMinutes: 60 }).balanceMinutes, 60);
  assert.equal(calculateStudyPlan({ ...example, minutes: 1, speed: 4 }).viewingMinutes, 0.25);
});

test('invalid ranges and non-finite inputs cannot produce a plan', () => {
  for (const [key, value] of [
    ['minutes', 0], ['minutes', 100001], ['speed', 0], ['speed', 4.1],
    ['days', 1.5], ['days', 0], ['days', 367], ['dailyMinutes', 1441],
    ['dailyMinutes', -1], ['reviewPercent', -1], ['reviewPercent', 201],
    ['minutes', NaN], ['speed', Infinity], ['days', '3']
  ]) assert.equal(calculateStudyPlan({ ...example, [key]: value }), null, `${key}: ${value}`);
});
