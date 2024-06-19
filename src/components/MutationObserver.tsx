import React, { useEffect, useRef, useState } from "react";

export default function MutationObserverCom() {
  const [className, setClassName] = useState<string>("bg-green-300");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      setClassName("bg-red-300");
    }, 2000);
  }, []);
  //   useEffect(() => {
  //     const observer = new MutationObserver((mutations: MutationRecord[]) => {
  //       console.log(mutations);
  //     });

  //     observer.observe(ref.current!, {
  //       attributes: true,
  //       childList: true,
  //       subtree: true,
  //       attributeFilter: ["class"],
  //     });
  //     return () => {
  //       observer.disconnect();
  //     };
  //   }, []);

  return (
    <MutateObserver
      onMutate={(mutations: MutationRecord[]) => {
        console.log(mutations, 1);
      }}
    >
      <div ref={ref} className={className}>
        mutation
      </div>
    </MutateObserver>
  );
}

const defaultOptions: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  //   attributeFilter: ["class", "style"],
};
interface MutationObserverProps {
  nodeOrList: HTMLElement | HTMLElement[];
  callback: MutationCallback;
  mutationOptions?: MutationObserverInit;
}

export function useMutationObserver(options: MutationObserverProps) {
  const { nodeOrList, callback, mutationOptions = defaultOptions } = options;
  useEffect(() => {
    if (!nodeOrList) return;
    const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList];
    let observer: MutationObserver;
    if ("MutationObserver" in window) {
      observer = new MutationObserver(callback);
      nodeList.forEach((node) => {
        console.log(60, observer);
        observer.observe(node, mutationOptions);
      });
    }
    return () => {
      console.log(65, observer);
      observer?.disconnect();
      observer?.takeRecords();
    };
  }, [nodeOrList, mutationOptions, callback]);
}
interface MutateObserverProps extends React.PropsWithChildren {
  options?: MutationObserverInit;
  onMutate: MutationCallback;
}
export const MutateObserver: React.FC<MutateObserverProps> = (props) => {
  const ref = React.useRef<HTMLElement>(null);
  const [target, setTarget] = React.useState<HTMLElement>();
  const callback = React.useCallback(props.onMutate, []);
  useMutationObserver({
    mutationOptions: props.options,
    callback,
    nodeOrList: target!,
  });

  React.useLayoutEffect(() => {
    setTarget(ref?.current as HTMLElement);
  }, []);

  if (!props.children) return null;
  return React.cloneElement(props.children as React.ReactElement, { ref });
};
