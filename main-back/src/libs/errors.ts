// HELPERS

export const throwOnUndefined = <T>(error: Error, value: T | undefined): T => {
  if (value === undefined) {
    throw error;
  }

  return value;
};

export const throwOnError = <T>(
  value: T,
  fn?: (prevErr: Error) => Error
): Exclude<T, Error> => {
  if (value instanceof Error) {
    throw fn ? fn(value) : value;
  }

  return value as Exclude<T, Error>;
};

export const returnOnThrow = async <R>(
  callback: () => Promise<R>
): Promise<R | Error> => {
  try {
    return await callback();
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    return e;
  }
};

export const Errors = {
  throwOnUndefined,
  throwOnError,
  returnOnThrow,
};
