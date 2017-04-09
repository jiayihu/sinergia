function isPromise(obj) {
  return typeof obj.then === 'function';
}

/**
 * Simple implementation of co lib
 */
export function co(genFunc) {
  return new Promise(resolve => {
    const genObj = genFunc();
    step(genObj.next());

    function step({ value, done }) {
      if (done) return;

      if (isPromise(value)) {
        value
          .then(result => {
            step(genObj.next(result)); // (A)
          })
          .catch(error => {
            step(genObj.throw(error)); // (B)
          });
      }

      if (value.value) {
        // It's the result
        resolve(value);
      }
    }
  });
}
