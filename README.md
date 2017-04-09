# Sinergia

[![npm](https://img.shields.io/npm/v/sinergia.svg)](https://www.npmjs.com/package/sinergia) [![travis](https://travis-ci.org/jiayihu/sinergia.svg?branch=master)](https://travis-ci.org/jiayihu/sinergia)

**sinergia** is a tiny library to run [cooperative](https://en.wikipedia.org/wiki/Cooperative_multitasking) expensive tasks on any `Iterable`* value in background, without blocking the UI during the computations and keeping 60fps frame rate.

(*) Any object which implements [Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) can be iterated. Native iterables are arrays, strings, Maps and Sets.

## Demo

A live example is available at [https://jiayihu.github.io/sinergia/](https://jiayihu.github.io/sinergia/), with an animated box which should remain smooth at 60fps.

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

In this example `expensiveTask` runs a long loop for every item, but every 100000 iterations it interrupts and gives the control to `sinergia`. `sinergia` will then resume the execution of `expensiveTask` when more suitable.

By using `yield` inside your `expensiveTask` you can decide the priority of the execution. *Yielding* often will run the task smoothly chunk by chunk but it will complete in more time. On the other hand *yielding* fewer times it will complete the task sooner but it will block more the main thread. *Yielding* zero times is equal to running the task *synchronously*.

```javascript
import co from 'co';
import { sinergia } from 'sinergia';

let iterator;

function* work() {
  // Array of elements
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');

  // Expensive task, ran with every item
  function* expensiveTask(acc, item) {
    let x = 0;
    while (x < 20000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and resumed later
      if (x % 100000 === 0) yield x;
    }

    // Simple result of task
    return `${acc}${item}`;
  }

  iterator = sinergia(iterable, expensiveTask, '');

  const result = yield* iterator;
  return result;
}

const task = co(work);
task.then((result) => {
  // If the work wasn't interrupted
  if (result) console.log(`Result: ${result.value}`);
});
```

### Abort execution

Since `sinergia` is just a generator, you can use the returned object to abort the execution using [.return()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return) method of generators.

```javascript
import co from 'co';
import { sinergia } from 'sinergia';

let iterator;

function* work() {
  // Array of elements
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');

  // Expensive task, ran with every item
  function* expensiveTask(acc, item) {
    let x = 0;
    while (x < 20000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and continued later
      if (x % 100000 === 0) yield x;
    }

    // Simple result of task
    return `${acc}${item}`;
  }

  iterator = sinergia(iterable, expensiveTask, '');

  const result = yield* iterator;
  return result;
}

const task = co(work);
task.then((result) => {
  // If the work wasn't interrupted
  if (result) console.log(`Result: ${result.value}`);
});

window.setTimeout(() => {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
}, 5000);
```

## API

#### sinergia(iterable: Iterable<any>, task: Function, initialValue: any, options: IOptions): Generator

- *task* has shape: `(accumulator: any, item: any) => any`

- *options* has shape:
  ```typescript
  interface IOptions {
    debug?: boolean;
  }
  ```

It runs asynchronously the `task` function for each item of the `iterable` in not blocking way.
Returns the [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) object.

## Credits

Ispiration comes largely from [@LucaColonnello](https://github.com/LucaColonnello) and [@cef62](https://github.com/cef62).
