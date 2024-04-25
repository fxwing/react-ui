import {
  useState,
  memo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

import { useLoaderData } from "react-router-dom";

interface Props {
  value?: Date;
  onChange?: (value: Date) => void;
}

interface RefProps {
  getDate: () => Date;
  setDate: (value: Date) => void;
}

export enum Month {
  "一" = 0,
  "二" = 1,
  "三" = 2,
  "四" = 3,
  "五" = 4,
  "六" = 5,
  "七" = 6,
  "八" = 7,
  "九" = 8,
  "十" = 9,
  "十一" = 10,
  "十二" = 11,
}

export const weeks = ["日", "一", "二", "三", "四", "五", "六"] as const;

const App = forwardRef<RefProps, Props>((props, ref) => {
  const [date, setDate] = useState(props?.value || new Date());
  const changeMonth = useCallback(
    (type: "prev" | "next") => {
      return () => {
        if (type === "next") {
          setDate(
            new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
          );
        }
        if (type === "prev") {
          setDate(
            new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
          );
        }
      };
    },
    [date]
  );
  useImperativeHandle(ref, () => {
    return {
      getDate: () => date,
      setDate: (value: Date) => setDate(value),
    };
  });

  const _renderDate = () => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDayWeek = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const list = [];
    for (let i = 0; i < firstDayWeek; i++) {
      list.push(
        <div key={i} className="h-8 leading-8 text-center text-stone-400">
          {new Date(year, month, i - firstDayWeek + 1).getDate()}
        </div>
      );
    }
    for (let i = 0; i < lastDay; i++) {
      list.push(
        <div
          key={i + firstDayWeek}
          className={`h-8 leading-8 cursor-pointer text-center hover:bg-slate-200 ${
            i === date.getDate() ? "bg-slate-200" : ""
          }`}
          onClick={props.onChange?.bind(null, new Date(year, month, i))}
        >
          {i + 1}
        </div>
      );
    }

    for (let i = lastDay + firstDayWeek + 1; i <= 42; i++) {
      list.push(
        <div key={i} className="h-8 leading-8 text-center text-stone-400">
          {new Date(year, month + 1, i - lastDay - firstDayWeek).getDate()}
        </div>
      );
    }

    return list;
  };
  return (
    <>
      <header className="flex h-8 text-xl w-full items-center justify-between bg-slate-200">
        <div
          className="cursor-pointer h-8 w-8 text-center"
          onClick={changeMonth("prev")}
        >
          &lt;
        </div>
        <div className="flex-1 text-center">
          {date?.getFullYear()}年{date?.getMonth() + 1}月
        </div>
        <div
          className="cursor-pointer h-8 w-8 text-center"
          onClick={changeMonth("next")}
        >
          &gt;
        </div>
      </header>
      <div className="grid grid-cols-7 h-8">
        {weeks.map((item: string, index) => {
          return (
            <div key={index} className="text-center leading-8">
              {item}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7">{_renderDate()}</div>
    </>
  );
});

const Calender = memo(App);

export function Component() {
  const data = useLoaderData() as string;
  const ref = useRef<RefProps>({} as RefProps);
  useEffect(() => {
    console.log(ref.current?.getDate());
    setTimeout(() => {
      ref.current?.setDate(new Date(2024, 8, 2));
    }, 2000);
  }, []);
  return (
    <>
      <div className="text-lg font-serif text-blue-300">
        异步获取到的数据：{data}
      </div>
      <Calender onChange={(date) => ref.current?.setDate(date)} ref={ref} />;
    </>
  );
}

export async function loader() {
  await new Promise((r) => setTimeout(r, 500));
  return "I came from the  loader function!";
}
