import { sinergia } from '../index';
import * as co from 'co';

describe('Basic behaviour', function() {
  let rafMock;
  let cafMock;

  const ITERABLE_LENGTH = 5;
  const ITERATIONS_PER_ITEM = 20;
  const ITERATIONS_PER_YIELD = 2;

  beforeEach(function() {
    rafMock = jest.fn((cb) => cb());
    cafMock = jest.fn();
    window.requestAnimationFrame = rafMock;
    window.cancelAnimationFrame = cafMock;
  });

  function* work() {
    const iterable = ['H', 'e', 'l', 'l', 'o'];

    function* expensiveTask(acc, item) {
      let x = 0;
      while (x < 20) {
        x = x + 1;
        if (x % 2 === 0) yield x;
      }

      return `${acc}${item}`;
    }

    return yield* sinergia(iterable, expensiveTask, '');
  }

  test('it should complete', function() {
    return co(work).then((result: any) => {
      expect(result.value).toBe('Hello');
    });
  });

  test('it should divide task in chunks', function() {
    return co(work).then((result: any) => {
      // requestAnimationFrame is called, for every item, 1 time to start the task
      // and ITERATIONS_PER_ITEM / ITERATIONS_PER_YIELD to complete it
      const times = ITERABLE_LENGTH * (ITERATIONS_PER_ITEM / ITERATIONS_PER_YIELD) + ITERABLE_LENGTH;
      expect(rafMock).toHaveBeenCalledTimes(times);
    });
  });

  test('it should cancel requestAnimationFrame when finished', function() {
    return co(work).then((result: any) => {
      const times = ITERABLE_LENGTH; // Once for every item
      expect(cafMock).toHaveBeenCalledTimes(times);
    });
  });
});
