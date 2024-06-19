/* eslint-disable no-debugger */
import React from "react";
interface MyContextProps {
  num: number;
  setNum: (num: number) => void;
}

const MyContext = React.createContext<MyContextProps>({} as MyContextProps);

export function Provider(props: React.PropsWithChildren<unknown>) {
  const { children } = props;
  const [num, setNum] = React.useState<number>(0);
  return (
    <MyContext.Provider value={{ num, setNum }}>{children}</MyContext.Provider>
  );
}

export function useNum(): MyContextProps {
  return React.useContext(MyContext);
}

export default function Test() {
  debugger;
  console.log("Test"); // 没有重新执行
  return (
    <Provider>
      <Aaa></Aaa>
      <Bbb></Bbb>
    </Provider>
  );
}

function Aaa() {
  const { num, setNum } = useNum();
  return (
    <div
      onClick={() => {
        setNum(num + 1);
      }}
    >
      {num}
    </div>
  );
}

function Bbb() {
  console.log("Bbb"); // 修改不会重新渲染
  return <>bbb</>;
}
