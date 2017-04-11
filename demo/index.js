import { sinergia } from '../lib/';

// import { sinergia } from 'sinergia';
import co from 'co';

function* work() {
  // Array of elements
  const iterable = 'Absent gods and silent tyranny We\'re going under hypnotised.'.split('');
  let result = '';

  for (let i = 0; i < iterable.length; i += 1) {
    let x = 0;

    while (x < 2000000) {
      x = x + 1;

      // Tell sinergia when the task can be interrupted and resumed later
      if (x % 100000 === 0) yield result;
    }

    // Simple result of task
    result += iterable[i];
    console.log(`Result of iteration:`, result);
  }
}

let iterator;

document.querySelector('.example1').addEventListener('click', function() {
  const task = co(function* () {
    iterator = sinergia(work);
    return yield* iterator;
  });
  task.then((result) => {
    // If the work wasn't interrupted
    if (result) console.log(`Result: ${result.value}`);
  });
});

document.querySelector('.example1-interrupt').addEventListener('click', function() {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
});
