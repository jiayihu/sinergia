# Sinergia

[![npm](https://img.shields.io/npm/v/sinergia.svg)](https://www.npmjs.com/package/sinergia) [![travis](https://travis-ci.org/jiayihu/sinergia.svg?branch=master)](https://travis-ci.org/jiayihu/sinergia)

**sinergia** is a tiny (1KB gzipped) library to run [cooperative](https://en.wikipedia.org/wiki/Cooperative_multitasking) expensive tasks  without blocking the UI during the computations and keeping 60fps frame rate.

## Demo

A live example is available at [https://jiayihu.github.io/sinergia/](https://jiayihu.github.io/sinergia/), with an animated box which should remain smooth at 60fps.

There are 2 examples:

1. [Long running loop](https://jiayihu.github.io/sinergia/#loop): Running an expensive function (with a 2mln iterations loop) with each item of an iterable

2. [Long merge sort](https://jiayihu.github.io/sinergia/#merge-sort): Running a common merge sort with an array of 100k items

It's possible to play with the demo locally cloning the repo and running:

```bash
cd demo # Go to demo folder
npm install # Or `yarn install`
npm start
```

## Installation

```
npm install sinergia --save
```

## Usage

> The following examples use [co](https://github.com/tj/co) to consume the generator functions.  

In this example `work` runs a long loop for every item, but every 100000 iterations it interrupts and gives the control to `sinergia`, which will resume the execution of `work` when more suitable.  

Execution tasks are by definition [cooperative](https://en.wikipedia.org/wiki/Cooperative_multitasking) because they decide when to `yield` the control of the execution.

By using `yield` inside your `work` you can decide the priority of the execution. *Yielding* often will run the task smoothly chunk by chunk but it will complete in more time. On the other hand *yielding* fewer times it will complete the task sooner but it will block more the main thread. *Yielding* zero times is equal to running the task *synchronously*.

```javascript
import co from 'co';
import { sinergia } from 'sinergia';

function* work() {
  const iterable = 'Absent gods.'.split('');
  let result = '';

  for (let item of iterable) {
    let x = 0;

    while (x < 2000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and resumed later
      if (x % 100000 === 0) yield result;
    }

    result += item; // Simple result of task
    console.log(`Result of iteration:`, result);
  }

  yield result; // Yield latest result
}

const execute = co(function* () {
  return yield* sinergia(work);
});
execute.then((result) => {
  // If the work wasn't interrupted
  if (result) console.log(`Result: ${result.value}`);
});
```

### Abort execution

Since `sinergia` is just a generator, you can use the returned object to abort the execution using [.return()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return) method of generators.

The method will return `{ value: any }` with the value of the result computed on the latest item before aborting.

```javascript
import co from 'co';
import { sinergia } from 'sinergia';

function* work() {
  const iterable = 'Absent gods.'.split('');
  let result = '';

  for (let item of iterable) {
    let x = 0;

    while (x < 2000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and resumed later
      if (x % 100000 === 0) yield result;
    }

    result += item; // Simple result of task
    console.log(`Result of iteration:`, result);
  }

  yield result; // Yield latest result
}

let iterator;

const execute = co(function* () {
  iterator = sinergia(work);
  return yield* iterator;
});
execute.then((result) => {
  // If the work wasn't interrupted
  if (result) console.log(`Result: ${result.value}`);
});

window.setTimeout(() => {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
}, 5000);
```

## API

#### sinergia(work: GeneratorFunction): Generator

It runs asynchronously the `work` function in not blocking way.
Returns the [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) object.

## Browser support

**sinergia** requires polyfills for:

1. *Promise* like [es6-promise](https://github.com/stefanpenner/es6-promise) or [core-js Promise](https://github.com/zloirock/core-js#ecmascript-6-promise). If you use [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) it's already included.

2. *requestAnimationFrame/cancelAnimationFrame*. See this [gist](https://gist.github.com/paulirish/1579671) as example.

## Credits

Ispiration comes largely from [@LucaColonnello](https://github.com/LucaColonnello) and [@cef62](https://github.com/cef62).
