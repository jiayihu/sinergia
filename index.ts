export function* sinergia(work: GeneratorFunction) {
  let result: any;
  let animToken: number;

  try {
    const workIterator: Generator = work();
    yield new Promise(resolve => {
      const step = () => {
        const iteration = workIterator.next();
        result = iteration.value;

        if (iteration.done) {
          resolve({ value: result });
        }

        animToken = window.requestAnimationFrame(step);
      };

      animToken = window.requestAnimationFrame(step);
    });

    return { value: result };
  } finally {
    // This block is called when sinergia is interrupted with `.return()`

    if (animToken) window.cancelAnimationFrame(animToken);
    yield { value: result };
  }
}
