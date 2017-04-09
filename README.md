# Sinergia

**sinergia** is a library to run expensive tasks on any iterable* value in background, without blocking the UI during the computations keeping 60fps frame rate.

Any object which implements [Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) can be iterated. Native iterables are arrays, strings, Maps and Sets.

## Installation

```
npm install sinergia --save
```

## Usage

> The following examples use [co](https://github.com/tj/co) to consume the generator functions.  

In this example `expensiveTask` runs a long loop for every item, but every 10000 iterations it interrupts waiting `sinergia`. `sinergia` will then continue the execution of `expensiveTask` when more suitable.

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
```

### Abort execution

Since `sinergia` is a common generator, you can use the returned object to abort the execution using [.return()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return) method of generators.

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

Ispiration comes largely from @LucaColonnello and @cef62.
