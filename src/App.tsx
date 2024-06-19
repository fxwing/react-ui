import { useEffect, useRef, useState } from "react";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  useNavigation,
  NavLink,
  NavLinkProps,
  RouteObject,
} from "react-router-dom";
// import Calender from "@/components/Calender";
// import Suspense from "@/components/Suspense";
// import Icon from "@/components/Icon";
// import Space from "@/components/Space";
// import Portal from "@/components/Portal";
// import MutationObserverCom from "@/components/MutationObserver";
// import CopyToClipboard from "@/components/CopyToClipboard";
// import ContextCom from "@/components/Context";
// import Jotai from "@/components/jotai";
// import DnD from "@/components/dnd";
// import Tooltip from "@/components/tooltip";

const modules = import.meta.glob(["./components/*.tsx"], { eager: true });

const routes: RouteObject[] = [];
for (const i in modules) {
  const name = /.\/components\/(.*)\.tsx/.exec(i);
  if (name) {
    routes.push({
      path: name[1],
      id: name[1],
      // lazy: () => import(`@/components/${name[1]}.tsx`),
      Component: (modules[i] as { default: React.ComponentType }).default,
    });
  }
}

// console.log(modules, routes);
// import img from "./assets/react.svg";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        id: "home",
        element: <Home />,
      },
      ...routes,
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

// console.log(App());

function Layout() {
  const navigation = useNavigation();
  const linkList = router.routes[0].children?.filter(
    (item) => item.path !== "*" && item.id !== "home"
  ) as RouteObject[];
  return (
    <div className="flex h-screen flex-col justify-center">
      {navigation.state !== "idle" && (
        <div className="fixed bg-slate-300  w-full h-full text-black grid place-items-center">
          <div className="text-3xl">Loading...</div>
        </div>
      )}

      <nav>
        <ul className="flex gap-4 p-4 h-auto  sm:flex-wrap">
          {linkList.map((item) => {
            return (
              <li key={item.id}>
                <MyLink to={item.path!}>{item.id}</MyLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

class Obj {
  data: number;
  constructor() {
    console.log("init");
    this.data = Math.random();
  }
}

function Home() {
  const ref = useRef(new Obj());
  const [, rerender] = useState({});
  console.log("--rerender");

  useEffect(() => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ratio = window.devicePixelRatio || 1;
    if (canvas) {
      canvas.setAttribute("width", `${300 * ratio}`);
      canvas.setAttribute("height", `${300 * ratio}`);
      canvas.setAttribute("style", `width: ${300}px; height: ${300}px;`);
      const ctx = canvas.getContext("2d")!;

      ctx.translate(150 * ratio, 150 * ratio);
      ctx.scale(ratio, ratio);

      // 获取 Canvas 上下文

      // 加载图像
      const img = new Image();
      img.src = new URL("./assets/react.svg", import.meta.url).href;

      // 设置图像旋转的角度
      const rotationAngle = (45 * Math.PI) / 180; // 45 度

      img.onload = function () {
        // 保存当前的 Canvas 状态
        ctx.save();

        // 移动到图像的中心点
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // 旋转图像
        ctx.rotate(rotationAngle);

        // 绘制旋转后的图像,以图像的中心点为原点
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // 恢复 Canvas 到之前的状态
        // ctx.restore();
      };
    }
  }, []);
  return (
    <div>
      {ref.current.data}
      <h2 className="text-3xl" onClick={() => rerender({})}>
        <canvas id="myCanvas"></canvas>
      </h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <MyLink className="block" to="/">
        Go to the home page
      </MyLink>
    </div>
  );
}

const linkBaseClass = "p-3 border border-slate-200 rounded-lg";
function MyLink(props: React.PropsWithChildren<NavLinkProps>): JSX.Element {
  return (
    <NavLink
      className={({ isActive, isPending }) => {
        return isPending
          ? `bg-slate-500 inline-block ${linkBaseClass} ${
              props.className ?? ""
            }`
          : isActive
          ? `bg-red-200 inline-block ${linkBaseClass} ${props.className ?? ""}`
          : `bg-slate-200 hover:bg-red-200 inline-block ${linkBaseClass} ${
              props.className ?? ""
            }`;
      }}
      to={props.to}
    >
      {props?.children}
    </NavLink>
  );
}

function mapTotree(data) {
  const tree = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.pId === 0) {
      tree.push(item);
    }
    const children = data.filter((d) => d.pid === item.id);
    if (children.length > 0) {
      item.children = children;
    }
  }
  return tree;
}
