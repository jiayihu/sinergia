export interface IOptions {
  debug?: boolean;
}

const defaultOptions: IOptions = {
  debug: false,
};

export function* sinergia(
  iterable: Iterable<any>,
  task: (accumulator: any, item: any) => any,
  initialValue: any,
  options: IOptions = {},
) {
  const actualOptions = { ...defaultOptions, ...options };
  let accumulator: any = initialValue;
  let animToken: number;

  try {
    for (const item of iterable) {
      const itemIterator: IterableIterator<any> = task(accumulator, item);

      yield new Promise(resolve => {
        const step = () => {
          const iteration = itemIterator.next();

          if (iteration.done) {
            if (actualOptions.debug) console.log(`item task is done with latest iteration`, iteration);
            accumulator = iteration.value;
            resolve();
          }
          else {
            requestAnimationFrame(step);
          }
        };

        animToken = requestAnimationFrame(step);
      });
    }

    return { value: accumulator };
  } finally {
    // This block is called when sinergia is interrupted with `.return()`

    if (animToken) cancelAnimationFrame(animToken);
    yield { value: accumulator };
  }
}
