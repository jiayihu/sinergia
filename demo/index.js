// import { sinergia } from '../lib/';

import { sinergia } from 'sinergia';
import co from 'co';

let iterator;

function* work() {
  // Array of elements
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');

  // Expensive task, ran with every item
  function* expensiveTask(acc, item) {
    let x = 0;
    while (x < 2000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and resumed later
      if (x % 100000 === 0) yield x;
    }

    // Simple result of task
    return `${acc}${item}`;
  }

  console.log('Starting work');
  iterator = sinergia(iterable, expensiveTask, '', { debug: true });

  const result = yield* iterator;
  return result;
}

document.querySelector('.example1').addEventListener('click', function() {
  const task = co(work);
  task.then((result) => {
    // If the work wasn't interrupted
    if (result) console.log(`Result: ${result.value}`);
  });
});

document.querySelector('.example1-interrupt').addEventListener('click', function() {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
});
