import React from "react";
import classNames from "classnames";
import { ErrorBoundary } from "./Suspense";
interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType | [SizeType, SizeType];
  direction?: "horizontal" | "vertical";
  align?: "start" | "end" | "center" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
}

export type SizeType = "small" | "medium" | "large" | number | undefined;
export function Space(props: SpaceProps) {
  const { space } = React.useContext(SpaceContext);
  console.log(space);
  const {
    className,
    style,
    direction,
    align,
    wrap,
    size = space.size || "small",
    ...rest
  } = props;

  console.log(React.Children.only(props.children));

  const nodeList = React.Children.toArray(props.children);
  const nodes = nodeList.map((child, index) => {
    return (
      <React.Fragment key={index}>
        <div className="w-4 h-4 bg-red-500">{child}</div>
        {index < nodeList.length - 1 && props.split && (
          <div style={style}>{props.split}</div>
        )}
      </React.Fragment>
    );
  });
  const spaceSize = {
    large: 24,
    medium: 16,
    small: 8,
  };
  const mergeAlign =
    direction === "horizontal" && align === undefined ? "center" : align;
  const [horizontalSize, verticalSize] = (
    Array.isArray(size) ? size : [size, size]
  ).map((item) => {
    if (typeof item === "number") {
      return item;
    } else {
      return spaceSize[item as keyof typeof spaceSize];
    }
  });
  console.log(horizontalSize, verticalSize);

  const horizontalGap = horizontalSize ? `gap-x-${horizontalSize}` : "";
  const verticalGap = verticalSize ? `gap-y-${verticalSize}` : "";
  const spaceClassName = classNames(
    "flex",
    horizontalGap,
    verticalGap,
    {
      "flex-row": direction === "horizontal",
      "flex-col": direction === "vertical",
      "items-center": mergeAlign === "center",
      "items-start": mergeAlign === "start",
      "items-end": mergeAlign === "end",
      "items-baseline": mergeAlign === "baseline",
      "flex-wrap": wrap,
    },
    className
  );

  return (
    <div className={spaceClassName} style={{ ...style }} {...rest}>
      {nodes}
    </div>
  );
}

export default function Test() {
  return (
    <SpaceProvide space={{ size: "large" }}>
      <Space align="center" direction="horizontal" split="|">
        {[<div key={1}></div>, [<div key={2}></div>, <div key={3}></div>]]}
      </Space>
    </SpaceProvide>
  );
}

interface SpaceProvideProps {
  space: {
    size: SizeType;
  };
}

export const SpaceContext = React.createContext<SpaceProvideProps>(
  {} as SpaceProvideProps
);

export function SpaceProvide(
  props: React.PropsWithChildren<SpaceProvideProps>
) {
  return (
    <SpaceContext.Provider value={{ space: props.space }}>
      <ErrorBoundary>{props.children}</ErrorBoundary>
    </SpaceContext.Provider>
  );
}
