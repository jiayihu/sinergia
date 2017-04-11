import { sinergia } from '../index';
import * as co from 'co';

describe('Basic behaviour', function() {
  let rafMock;

  const ITERABLE_LENGTH = 5;
  const ITERATIONS_PER_ITEM = 20;
  const ITERATIONS_PER_YIELD = 2;

  beforeEach(function() {
    rafMock = jest.fn((cb) => cb());
    window.requestAnimationFrame = rafMock;
  });

  const work: any = function*() {
    const iterable = ['H', 'e', 'l', 'l', 'o'];
    let result = '';

    for (const item of iterable) {
      let x = 0;
      while (x < 20) {
        x = x + 1;
        if (x % 2 === 0) yield result;
      }

      result += item;
    }

    yield result;
  };

  test('it should complete', function() {
    return co(function*(){
      return yield* sinergia(work);
    }).then((result: any) => {
      expect(result.value).toBe('Hello');
    });
  });

  test('it should divide task in chunks', function() {
    return co(function*(){
      return yield* sinergia(work);
    }).then((result: any) => {
      // requestAnimationFrame is called ITERATIONS_PER_ITEM / ITERATIONS_PER_YIELD
      // times to complete an item, plus 1 first call and 1 call for the final result
      const times = ITERABLE_LENGTH * (ITERATIONS_PER_ITEM / ITERATIONS_PER_YIELD) + 2;
      expect(rafMock).toHaveBeenCalledTimes(times);
    });
  });
});
