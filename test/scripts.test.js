'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const s = require('..');

test('detects RTL scripts', () => {
  assert.deepStrictEqual(s.rtlScriptsIn('مرحبا').map(x => x.name), ['Arabic']);
  assert.deepStrictEqual(s.rtlScriptsIn('שלום').map(x => x.name), ['Hebrew']);
  assert.strictEqual(s.rtlScriptsIn('Hello').length, 0);
});

test('native-digit scripts (Arabic/Thaana/N\'Ko/Adlam) — not Hebrew/Syriac', () => {
  assert.deepStrictEqual(s.nativeDigitScriptsIn('عربي').map(x => x.name), ['Arabic']);
  assert.strictEqual(s.nativeDigitScriptsIn('עברית').length, 0, 'Hebrew uses Western digits');
});

test('runtime-independent: newer Unicode blocks detected by range, not ICU', () => {
  // Arabic Extended-C U+10EFC is script "Arabic" only from Unicode 15.1, so a
  // \p{Script} class disagreed across engines — the explicit range does not.
  assert.deepStrictEqual(s.nativeDigitScriptsIn('\u{10EFC}5').map(x => x.name), ['Arabic']);
});

test('no-space scripts flagged for segmentation, space-delimited ones are not', () => {
  assert.ok(s.anyNoSpaces(s.detectScripts('สวัสดี')), 'Thai is no-space');
  assert.ok(!s.anyNoSpaces(s.detectScripts('مرحبا')), 'Arabic is space-delimited');
});

test('cursive gate: Arabic joins, Hebrew/CJK do not', () => {
  assert.ok(s.anyCursive(s.detectScripts('مرحبا')));
  assert.ok(!s.anyCursive(s.detectScripts('שלום')));
});

test('pure ASCII / empty → no scripts', () => {
  assert.strictEqual(s.detectScripts('').length, 0);
  assert.strictEqual(s.detectScripts('hello world 123').length, 0);
});
