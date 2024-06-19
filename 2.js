function findArr(arr, n) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === n) {
        result.push([arr[i], arr[j]]);
      }
    }
  }
}

function findArr2(arr, n) {
  const set = new Set();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (set.has(n - arr[i])) {
      result.push([arr[i], n - arr[i]]);
    }
    set.add(arr[i]);
  }
  return false;
}

function hasPairs(arr, a, b) {
  for (let [x, y] of arr) {
    if ((x === a && y === b) || (x === b && y === a)) return true;
  }
  return false;
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  let l = [],
    r = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > pivot) {
      r.push(arr[i]);
    } else {
      l.push(arr[i]);
    }
  }
  return quickSort(l).concat(pivot, quickSort(r));
}

function isP(str) {
  let l = 0,
    r = str.length - 1;
  while (l < r) {
    if (str[l] !== str[r]) return false;
    l++;
    r--;
  }
  return true;
}

function curry(fn) {
  return function curried(...args) {
    if (fn.length > args.length) {
      fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function promiseAll(arr) {
  return new Promise((resolve, reject) => {
    const result = [];
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i]).then(
        (res) => {
          result[i] = res;
          idx++;
          if (arr.length === idx) resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}

function qucikDort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr[0];
  const left = [];
  const right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...qucikDort(left), mid, ...qucikDort(right)];
}
