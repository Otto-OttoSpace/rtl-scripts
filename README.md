# @ottospace/rtl-scripts

Zero-dependency world-scripts table + RTL / bidi / shaping-aware detection,
shared by the OttoSpace RTL toolchain (**miraat**, **lahja**, **kashida**).

Script detection uses **explicit Unicode codepoint ranges**, not
`\p{Script=…}` property escapes — so results are identical on every runtime
(Node 18/20/22, Deno, Bun, edge) instead of tracking the engine's bundled ICU
version.

```js
const s = require('@ottospace/rtl-scripts');
s.rtlScriptsIn('مرحبا');            // [Arabic]
s.nativeDigitScriptsIn('عربي 5');   // [Arabic]  (Western digits in Arabic text = a bug)
s.anyNoSpaces(s.detectScripts('สวัสดี')); // true (Thai needs a segmenter)
```

MIT © OttoSpace.
