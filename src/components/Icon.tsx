import React, { forwardRef, useLayoutEffect, useRef } from "react";
import classNames from "classnames";

interface BaseIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: string | Array<string>;
  spin?: boolean;
}

type IconProps = BaseIconProps &
  Omit<React.SVGAttributes<SVGSVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps["size"]) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as Array<string>;
  }
  const width = (size as string) || "1em";
  const height = (size as string) || "1em";
  return [width, height];
};

export const Icon = forwardRef<
  SVGSVGElement,
  React.PropsWithChildren<IconProps>
>((props, ref: React.Ref<SVGSVGElement>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className, style, size = "1em", spin, children, ...rest } = props;
  const [width, height] = getSize(size);
  const classnames = classNames(
    "inline-block",
    "text-current",
    spin ? "animate-spin" : "",
    className
  );

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      className={classnames}
      fill="currentColor"
      style={style}
      {...rest}
    >
      {children}
    </svg>
  );
});

interface CreateIconOptions {
  content?: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

export function createIcon(
  options: CreateIconOptions
): React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
> {
  const { content, iconProps, viewBox = "0 0 1024 1024" } = options;
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    return (
      <Icon ref={ref} {...iconProps} viewBox={viewBox} {...props}>
        {content}
      </Icon>
    );
  });
}
const scriptUrlSet = new Set();
export function createFromIconfont(scriptUrl: string) {
  if (typeof scriptUrl === "string" && scriptUrl.length) {
    if (!scriptUrlSet.has(scriptUrl)) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script["data-namespace"] = scriptUrl;
      document.body.appendChild(script);
      scriptUrlSet.add(scriptUrl);
    }
  }
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;
    return (
      <Icon ref={ref} {...rest}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });
}

export const IconAdd = createIcon({
  content: (
    <>
      <path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
    </>
  ),
});
export const IconFont = createFromIconfont(
  "//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js"
);
// export default Icon;
//  em  font-szie是相对于父元素  别的属性是相对于当前元素的font-size
export default function Test() {
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    console.log(ref.current?.getBBox());
  }, []);
  return (
    <>
      <IconAdd size="2em" spin></IconAdd>
      <IconFont
        type="icon-shouye-zhihui"
        size={["30px", "50px"]}
        ref={ref}
        spin
      ></IconFont>
    </>
  );
}
