import React, { Suspense } from "react";

//  throw 一个promise
//  errorboundary  是throw  一个error

export default function SuspenseComponent() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary>
          <A></A>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

function A() {
  return <B></B>;
}

let data;
function B() {
  if (data) return <>{data}</>;
  //   throw new Error("error");
  throw new Promise((resolve) =>
    setTimeout(() => {
      data = 2;
      resolve(1);
    }, 2000)
  );
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
