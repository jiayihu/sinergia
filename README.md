# Sinergia

## Installation

```
npm install sinergia --save
```

## Usage

The following examples use [co](https://github.com/tj/co) to consume the generator functions.

```javascript
import co from 'co';
import { sinergia } from 'sinergia';

function* work() {
  // Array of elements
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');

  // Expensive task, ran with every item. Its signature is similar to Array.reduce callbacks
  function* expensiveTask(accumulator: string, item) {
    let x = 0;
    while (x < 200000) {
      x = x + 1;
      yield;
    }

    // Simple result of task
    return `${accumulator}${item}`;
  }

  return yield* sinergia(iterable, expensiveTask, '');
}

const task = co(work); // Use co
task.then((result) => {
  // If the work wasn't interrupted
  if (result) console.log(`Result: ${result}`);
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
  function* expensiveTask(acc: string, item) {
    let x = 0;
    while (x < 200000) {
      x = x + 1;
      yield;
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
  if (result) console.log(`Result: ${result}`);
});

window.setTimeout(() => {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
}, 5000);
```

## API

#### sinergia(iterable: Iterable<any>, task: Function, initialValue: any): Generator

*task* has shape: `(accumulator: any, item: any) => any`

It runs asynchronously the `task` function for each item of the `iterable` in not blocking way.
Returns the [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) object.

## Credits

Ispiration comes largely from @LucaColonnello and @cef62.
