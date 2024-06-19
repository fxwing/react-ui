import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";

export default function Test() {
  const ref = useRef<HTMLElement>(null);
  const content = (
    <>
      <article className="prose sm:bg-primary">
        <h1>Garlic bread with cheese: What the science tells us</h1>
        <p>
          For years parents have espoused the health benefits of eating garlic
          bread with cheese to their children, with the food earning such an
          iconic status in our culture that kids will often dress up as warm,
          cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked
          to a series of rabies cases springing up around the country.
        </p>
      </article>
      <input className="px-4 py-3 rounded-full w-2/5 border-none focus:border-solid focus:border focus:border-primary"></input>
      <button className="btn-primary">按钮</button>
    </>
  );
  useEffect(() => {
    console.log(ref.current);
  }, []);
  return <Portal ref={ref}>{content}</Portal>;
}

interface ProtalProps extends React.PropsWithChildren {
  attach?: HTMLElement | string;
}
export const Portal = forwardRef<HTMLElement, ProtalProps>(
  (props: ProtalProps, ref) => {
    function getAttach(attach?: HTMLElement | string): HTMLElement {
      if (typeof attach === "string") {
        return document.querySelector(attach) as HTMLElement;
      }
      if (typeof attach === "object" && attach instanceof HTMLElement) {
        return attach;
      }
      return document.body;
    }
    const container = useMemo(() => {
      const container = document.createElement("div");
      container.className =
        "portal-container border-4 border-primary box-border";
      return container;
    }, []);
    useImperativeHandle(ref, () => container, [container]);

    const parentElement = getAttach(props.attach);

    useEffect(() => {
      parentElement.appendChild(container);
      return () => {
        parentElement.removeChild(container);
      };
    }, [parentElement, container]);

    return createPortal(props.children, container);
  }
);
