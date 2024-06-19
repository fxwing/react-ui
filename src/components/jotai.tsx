import {
  Provider,
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  PrimitiveAtom,
} from "jotai";
import React from "react";
import { atomWithStorage } from "jotai/utils";
import { Button } from "antd";

export default () => {
  return (
    <Provider>
      <App />
      <Child></Child>
    </Provider>
  );
};

type Data = {
  num: number;
  name: string;
};
const countAtom = atomWithStorage("count", [{ num: 1, name: "1" }]);

function App() {
  const setCount = useSetAtom(countAtom);
  console.log("render");
  return (
    <div>
      <p>hello app</p>
      <Button
        onClick={() =>
          setCount((prev: Data[]) => [
            ...prev,
            { num: Math.random(), name: Math.random().toString() },
          ])
        }
      >
        click
      </Button>
    </div>
  );
}

function Child() {
  const count = useAtomValue(countAtom);
  return (
    <div>
      {count.map((item) => (
        <div key={item.num}>
          {item.name} - {item.name}
        </div>
      ))}
    </div>
  );
}
