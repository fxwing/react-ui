import React from "react";
interface CopyToClipboardProps extends React.PropsWithChildren {
  text?: string;
  onCopy?: (
    value?: string,
    options?: { debug?: boolean; message?: string; format?: string }
  ) => void;
  options?: { debug?: boolean; message?: string; format?: string };
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const { text, onCopy, options, children } = props;
  const ele = React.Children.only(children) as React.ReactElement;
  function onClick(event: MouseEvent) {
    const ele = React.Children.only(children) as React.ReactElement;
    if (onCopy) {
      onCopy(text, options);
    }

    if (typeof ele?.props?.onClick === "function") {
      ele.props.onClick(event);
    }
  }
  return React.cloneElement(ele, { onClick });
}

export default function Test() {
  return (
    <CopyToClipboard
      text="复制的内容"
      options={{ debug: true, message: "复制成功", format: "text/plain" }}
      onCopy={(text, options) => {
        console.log("复制成功", text, options);
      }}
    >
      <button className="btn-primary">点击复制</button>
    </CopyToClipboard>
  );
}
