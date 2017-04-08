import co from 'co';
import { sinergia } from '../index';

let iterator: IterableIterator<any>;

function* work() {
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');

  // Expensive task, ran with every item
  function* expensiveTask(acc: string, item) {
    let x = 0;
    while (x < 200000) {
      x = x + 1;
      yield;
    }

    // simple `reducer` function composing a string
    return `${acc}${item}`;
  }

  iterator = sinergia(iterable, expensiveTask, '');

  const result = yield* iterator;
  return result;
}

document.querySelector('.example1').addEventListener('click', function() {
  const task = co(work);
  task.then((result) => {
    // If the work wasn't interrupted
    if (result) console.log(`Result: ${result}`);
  });
});

document.querySelector('.example1-interrupt').addEventListener('click', function() {
  const result = iterator.return();
  console.log('Interrupted result', result);
});
