import { sinergia } from '../lib/';

// import { sinergia } from 'sinergia';
import co from 'co';

const largeList = new Array(100000);
for (let i = 0; i < largeList.length; i += 1) largeList[i] = Math.floor(Math.random() * 10000);

function* work(values) {
  const sort = function*(array) {
    const len = array.length;
    if (len < 2) {
      return array;
    }
    const pivot = Math.ceil(len / 2);
    return yield* merge(
      yield* sort(array.slice(0, pivot)),
      yield* sort(array.slice(pivot))
    );
  };

  const merge = function*(left, right) {
    let result = [];
    while ((left.length > 0) && (right.length > 0)) {
      if (left[0] > right[0]) {
        result.push(left.shift());
      }
      else {
        result.push(right.shift());
      }
    }

    result = result.concat(left, right);
    if (result.length > 100) {
      // Pause when the merges start to become expensive
      yield result;

      // Don't always log
      if (Math.floor(Math.random() * 10) === 1) console.log('I\'m working...');
    }
    return result;
  };

  return yield* sort(values);
}

let iterator;

document.querySelector('.merge').addEventListener('click', function () {
  const execute = co(function* () {
    iterator = sinergia(work.bind(null, largeList));
    return yield* iterator;
  });
  execute.then((result) => {
    // If the work wasn't interrupted
    if (result) console.log(`Result: ${result.value}`);
  });
});

document.querySelector('.merge-interrupt').addEventListener('click', function () {
  const result = iterator.return();
  console.log('Interrupted result', result.value);
});
