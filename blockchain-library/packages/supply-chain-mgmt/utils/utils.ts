/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */

export const arrayCompare = (array1: number[], array2: number[]) : boolean => {
    const array2Sorted = array2.slice().sort();
    return array1.length !== array2.length && array1.slice().sort().every((value, index) => value !== array2Sorted[index]);
};

export const asyncPipe = <T>(functions: Array<(...x: any) => Promise<T>>): (a?: any) => Promise<Array<T>> => (x?: any) => functions.reduce(async (y: any, f: any) => f(await y), x);

export const resolvePromiseSequentially = async<T>(functions: Array<() => Promise<T>>): Promise<Array<T>> => {
    const results = [];
    for (const fn of functions) {
        results.push(await fn());
    }
    return results;
};
