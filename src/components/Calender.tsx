import React from "react";
import dayjs, { Dayjs } from "dayjs";
import classNames from "classnames";

interface CalenderProps {
  value?: Dayjs;
  onChange?: (value: Dayjs) => void;
  style?: React.CSSProperties;
  className?: string | string[];
  // 定制日期显示，会覆盖日期单元格
  dateRender?: (date: Dayjs) => React.ReactNode;
  // 日期渲染添加在单元格内
  dateInnerContent?: (date: Dayjs) => React.ReactNode;
  locale?: string;
}
interface CalenderHeaderProps extends CalenderProps {
  selectHandler: (date: Dayjs) => void;
}
interface MonthCalenderProps extends CalenderProps {
  selectHandler: (date: Dayjs) => void;
}

export interface CalendarType {
  formatYear: string;
  formatMonth: string;
  today: string;
  month: {
    January: string;
    February: string;
    March: string;
    April: string;
    May: string;
    June: string;
    July: string;
    August: string;
    September: string;
    October: string;
    November: string;
    December: string;
  } & Record<string, any>;
  week: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  } & Record<string, any>;
}

export const CalendarLocale_en_US: CalendarType = {
  formatYear: "YYYY",
  formatMonth: "MMM YYYY",
  today: "Today",
  month: {
    January: "January",
    February: "February",
    March: "March",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "August",
    September: "September",
    October: "October",
    November: "November",
    December: "December",
  },
  week: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
};
export const CalendarLocale_zh_CN: CalendarType = {
  formatYear: "YYYY 年",
  formatMonth: "YYYY 年 MM 月",
  today: "今天",
  month: {
    January: "一月",
    February: "二月",
    March: "三月",
    April: "四月",
    May: "五月",
    June: "六月",
    July: "七月",
    August: "八月",
    September: "九月",
    October: "十月",
    November: "十一月",
    December: "十二月",
  },
  week: {
    monday: "周一",
    tuesday: "周二",
    wednesday: "周三",
    thursday: "周四",
    friday: "周五",
    saturday: "周六",
    sunday: "周日",
  },
};

export const allLanguages: Record<"en-US" | "zh-CN", CalendarType> = {
  "en-US": CalendarLocale_en_US,
  "zh-CN": CalendarLocale_zh_CN,
};

export const CalenderHeader: React.FC<CalenderHeaderProps> = (props) => {
  const { value = dayjs(), selectHandler } = props;
  const { locale } = React.useContext(LocaleContext);
  const language = allLanguages[locale];
  return (
    <div className="flex items-center p-4 [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*:not(:last-child)]:mr-4">
      <div
        className="cursor-pointer"
        onClick={() => selectHandler(value.subtract(1, "month"))}
      >
        &lt;
      </div>
      <div>{value.format(language.formatMonth)}</div>
      <div
        className="cursor-pointer"
        onClick={() => selectHandler(value.add(1, "month"))}
      >
        &gt;
      </div>
      <button
        onClick={() => selectHandler(dayjs())}
        className="bg-slate-300 rounded-lg p-2"
      >
        {language.today}
      </button>
    </div>
  );
};

export function MonthCalender(props: MonthCalenderProps): JSX.Element {
  const weeks = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const { dateRender, dateInnerContent, value, selectHandler } = props;
  const { locale } = React.useContext(LocaleContext);

  function getAllDays(value: Dayjs = dayjs()) {
    const startDay = value.startOf("month"); // 获取当月第一天
    const day = startDay.day(); // 获取当月第一天是周几
    const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
      6 * 7
    );

    for (let i = 0; i < day; i++) {
      daysInfo[i] = {
        date: startDay.subtract(day - i, "day"),
        currentMonth: false,
      };
    }
    for (let i = day; i < daysInfo.length; i++) {
      const calcDate = startDay.add(i - day, "day");
      daysInfo[i] = {
        date: calcDate,
        currentMonth: calcDate.month() === value.month(),
      };
    }

    return daysInfo;
  }
  const allDays = getAllDays(value);
  const renderDate = (data: Array<{ date: Dayjs; currentMonth: boolean }>) => {
    return data.map((item, index) => {
      return (
        <div
          className={classNames(
            "h-16 text-center  cursor-pointer overflow-hidden",
            item.currentMonth ? "text-slate-700" : "text-slate-300",
            {
              "bg-red-400":
                value?.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD"),
            }
          )}
          key={index + item.date.format("YYYY-MM-DD")}
          onClick={() => {
            selectHandler(item.date);
          }}
        >
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div>
              <div>{item.date.date()}</div>
              {dateInnerContent ? dateInnerContent(item.date) : null}
            </div>
          )}
        </div>
      );
    });
  };
  return (
    <>
      <div className="w-full grid grid-cols-7">
        {weeks.map((item: string, index) => {
          return (
            <div className="text-center h-full leading-16" key={index}>
              {allLanguages[locale].week[item]}
            </div>
          );
        })}
        {renderDate(allDays)}
      </div>
    </>
  );
}

export function Calender(props: CalenderProps) {
  const [date, setDate] = React.useState<Dayjs>(props.value || dayjs());

  return (
    <LocaleContext.Provider
      value={{ locale: props.locale! || navigator.language || "zh-CN" }}
    >
      <div className={classNames(props.className)} style={props.style}>
        <CalenderHeader
          {...props}
          value={date}
          selectHandler={setDate}
        ></CalenderHeader>
        <MonthCalender
          {...props}
          value={date}
          selectHandler={setDate}
        ></MonthCalender>
      </div>
    </LocaleContext.Provider>
  );
}

export default function Component(): JSX.Element {
  return (
    <>
      <Calender
        value={dayjs("2024-04-08")}
        onChange={(value) => console.log(value.format("YYYY-MM-DD"))}
        locale="en-US"
        // style={{ border: "1px solid red", background: "yellow" }}
        // dateRender={(date) => (
        //   <div className="text-red-500 h-screen w-full">
        //     {date.format("YYYY-MM-DD")}
        //   </div>
        // )}
        // dateInnerContent={(date) => (
        //   <div className="text-red-500 w-full">{date.format("YYYY-MM-DD")}</div>
        // )}
      ></Calender>
    </>
  );
}

interface LocaleContextProps {
  locale: string;
}
export const LocaleContext = React.createContext<LocaleContextProps>({
  locale: "zh-CN",
});
