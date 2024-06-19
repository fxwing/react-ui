import React from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import {
  useFloating,
  useHover,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  arrow,
  FloatingArrow,
  flip,
} from "@floating-ui/react";
type Aligment = "begin" | "end";
type Side = "top" | "bottom" | "left" | "right";
type AlignedPlacement = `${Side}-${Aligment}`;
export default function App() {
  const [open, setOpen] = React.useState<boolean>(false);
  const arrowRef = React.useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "left-start",
    middleware: [
      offset(10),
      arrow({
        element: arrowRef,
      }),
      flip(),
    ],
  });

  const el: HTMLDivElement = React.useMemo(() => {
    const el = document.createElement("div");
    el.className = "wraper";
    document.body.appendChild(el);
    return el;
  }, []);

  const hover = useHover(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getFloatingProps, getReferenceProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);
  console.log(getReferenceProps);

  const floating = open ? (
    <div
      className="px-4 py-8 border border-gray-500 rounded-sm bg-slate-300 text-yellow-50"
      ref={refs.setFloating}
      {...getFloatingProps}
      style={floatingStyles}
    >
      逛逛
      <FloatingArrow
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
        ref={arrowRef}
        context={context}
      />
    </div>
  ) : null;
  return (
    <>
      <Button ref={refs.setReference} {...getReferenceProps}>
        测试
      </Button>
      {ReactDOM.createPortal(floating, el)}
    </>
  );
}
