// [1,1,2222,3]
[1, 1];

function find1(arr) {
  const map = {};
  arr.forEach((item) => {
    if (map(item)) {
      map[item] = map[item] + 1;
    } else {
      map[item] = 1;
    }
  });
  Object.entries(map).find(([k, num]) => {
    return num === 1;
  });
}

function findOddOccurringElement(arr) {
  const list = [];

  for (let i = 0; i < arr.length; i++) {
    if (list[arr[i]]) {
      list.pop();
    } else {
      list.push(arr[i]);
    }
  }
  return arr[0];
}

type MyPick<T,P extends keyof T> = {
    [K in P]: T[K]
} 

type MyOmit<T,P extends keyof T> = Pick<T,Exclude<keyof T,P>>

type MyPartial<T  extends  object> = {
    [K in keyof T]?: T[K]
}

type MyRequired<T extends object> = {
    [K in keyof T]-?: T[K]
}


type MyExclude<T,U> = T extends U?never:T

type MyExtract<T,U> = T extends U?T:never

type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]   
}


type  MyRecord<T extends keyof any,P>={
    [K in T]:P
}

type MyNonNullable<T> = T extends null | undefined ? never : T

type  MyParameters<T extends (...args:any[])=>any> = T extends (...args:infer P)=> any? P : never

type MyReturnType<T extends (...args:any[])=>any> = T extends (...args:any[])=> infer R ? R : never


const  o ={}
const  proxy = new Proxy(0,{
    set(){

    },
    get(){
        return 0
    },
    deleteProperty(){},
    has(){},
    getOwnPropertyDescriptor(){},
    getPrototypeOf(){},
    isExtensible(){},
    ownKeys(){},
    preventExtensions(){},
    setPrototypeOf(){},
})