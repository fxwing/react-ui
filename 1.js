class Emitter {
  constructor() {
    this.events = {};
  }

  on(type, callback) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  emit(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach((callback) => callback(...args));
    }
  }

  off(type, callback) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter((cb) => cb !== callback);
    }
  }
  once(type, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(type, wrapper);
    };
    this.on(type, wrapper);
  }
}

function throttle(fn, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
}).then(() => {
  console.log(3);
});

console.log(4);

function binarySearch(arr, target) {
  arr.sort((a, b) => a - b);
  let l = 0,
    r = arr[arr.length - 1];

  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    if (mid === target) {
      return mid;
    } else if (mid > target) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  return -1;
}

function curry(fn) {
  return function curried(...args1) {
    if (fn.length === arguments.length) {
      return fn.apply(this, args1);
    } else {
      return function (...args) {
        return curried.apply(this, args1.concat(args));
      };
    }
  };
}

const ps = [() => {}, () => {}];

function execPromise(list) {
  return list.reduce((prev, curr) => {
    return prev.then(() => curr());
  }, Promise.resolve());
}

console.log("asd".substr(1, 1));

function flatten(arr) {
  return arr.reduce((prev, curr) => {
    return Array.isArray(curr) ? [...prev, ...flatten(curr)] : [...prev, curr];
  }, []);
}

function flatten2(arr) {
  const res = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res.push(...flatten2(item));
    } else {
      res.push(item);
    }
  });
  return res;
}

console.log(flatten2([1, [2, [3, 4, 5]]]));

function curry(fn) {
  return function curried(...arg1) {
    if (fn.length > arg1.length) {
      fn.apply(this, arg1);
    } else {
      return function (...arg2) {
        curried.apply(this, arg1.concat(arg2));
      };
    }
  };
}

function toTree(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (arr[i].pid === 0) {
      result.push(item);
    }
    const children = arr.filter((d) => d.pid === item.id);
    if (children.length > 0) {
      item.children = children;
    }
  }
  return result;
}

const result = toTree([
  {
    id: 1,
    pid: 0,
    name: "body",
  },
  {
    id: 2,
    pid: 1,
    name: "title",
  },
  {
    id: 3,
    pid: 2,
    name: "div",
  },
  {
    id: 4,
    pid: 0,
    name: "html",
  },
  {
    id: 5,
    pid: 4,
    name: "div",
  },
  {
    id: 6,
    pid: 5,
    name: "span",
  },
  {
    id: 7,
    pid: 5,
    name: "img",
  },
]);

function toArray(arr) {
  const result = [];
  function loop(arr) {
    arr.forEach((item) => {
      result.push(item);
      if (item.children) {
        loop(item.children);
      }
    });
  }

  loop(arr);

  return result;
}

console.log(toArray(result));

for (let i = 0; i < 3; i++) {
  setTimeout(
    () => {
      console.log(i);
    },
    1000 * i,
    i
  );
}

function myInterval(fn, delay) {
  let timerId = null;
  function loop() {
    timerId = setTimeout(fn, delay);
    loop();
  }

  setTimeout(loop, delay);
  return timerId;
}

function bobulleSort(arr) {
  if (arr.length <= 1) return arr;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

console.log(bobulleSort([2, 1, 1, 2, 3, 4, 2, 1]));

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
console.log(quickSort([2, 1, 3, 4, 2, 1]));

// 选择排序
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    if (i !== min) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}

// 插入排序
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j] < arr[j - 1]) {
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      j--;
    }
  }
  return arr;
}

function randomArr(arr) {
  if (arr.length <= 1) return arr;
  for (let i = 0; i < arr.length; i++) {
    let random = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
}

console.log(randomArr([1, 2, 3, 4, 5]));

function add(a, b) {
  const arr1 = a.split("").reverse();
  const arr2 = b.split("").reverse();
  const result = [];
  let carry = 0;
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const a1 = parseInt(arr1[i]) || 0;
    const a2 = parseInt(arr2[i]) || 0;
    const num = a1 + a2 + carry;
    result.push(num % 10);
    carry = Math.floor(num / 10);
  }

  if (carry) {
    result.push(carry);
  }

  return result.reverse().join("");
}

function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];
  let prefex = strs[0];
  for (let i = 0; i < strs.length; i++) {
    while (strs[i].indexOf(prefex) !== 0) {
      prefex = prefex.slice(0, prefex.length - 1);
      if (prefex.length === 0) return "";
    }
  }
  return prefex;
}
function lengthOfLongestSubstring() {}
