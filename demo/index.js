import { sinergia } from '../lib/';

// import { sinergia } from 'sinergia';
import co from 'co';

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

document.querySelector('.example1').addEventListener('click', function() {
  const execute = co(function* () {
    iterator = sinergia(work);
    return yield* iterator;
  });
  execute.then((result) => {
    // If the work wasn't interrupted
    if (result) console.log(`Result: ${result.value}`);
  });
});

document.querySelector('.example1-interrupt').addEventListener('click', function() {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
});
