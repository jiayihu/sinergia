const ITERATIONS_PER_FRAME = 10000;

export function* sinergia(iterable: Iterable<any>, task: (accumulator: any, item: any) => any, initialValue: any) {
  let accumulator: any = initialValue;
  let animToken: number;

  try {
    for (const item of iterable) {
      const itemIterator = task(accumulator, item);

      yield new Promise(resolve => {
        const step = (timestamp) => { // timestamp not used
          let iteration = itemIterator.next();

          for (let i = 0; i < ITERATIONS_PER_FRAME && !iteration.done; i++) {
            iteration = itemIterator.next();
          }

          if (!iteration.done) window.requestAnimationFrame(step);
          else {
            console.log(`item transformation is done with latest iteration`, iteration);
            accumulator = iteration.value;
            window.cancelAnimationFrame(animToken);
            resolve();
          }
        };

        animToken = window.requestAnimationFrame(step);
      });
    }

    return accumulator;
  } finally {
    if (animToken) window.cancelAnimationFrame(animToken);
    yield accumulator;
  }
}
