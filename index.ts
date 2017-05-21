export function* sinergia(work: GeneratorFunction) {
  let result: any;
  let animToken: number;
  let _resolve;

  try {
    const workIterator: Generator = work();
    yield new Promise(resolve => {
      _resolve = resolve;

      const step = () => {
        const iteration = workIterator.next();

        if (iteration.done) {
          resolve();
          return;
        }

        result = iteration.value;
        animToken = window.requestAnimationFrame(step);
      };

      animToken = window.requestAnimationFrame(step);
    });

    return { value: result };
  } finally {
    // This block is called when sinergia is interrupted with `.return()`

    if (animToken) window.cancelAnimationFrame(animToken);
    _resolve();

    // Return the latest yielded result
    yield { value: result };
  }
}
