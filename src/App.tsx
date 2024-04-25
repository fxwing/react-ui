import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  useNavigation,
  NavLink,
  NavLinkProps,
  RouteObject,
} from "react-router-dom";
import Calender from "@/components/Calender";

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
      {
        path: "miniCalender",
        id: "miniCalender",
        lazy: () => import("@/components/MiniCalender"),
      },
      {
        path: "calender",
        id: "calender",
        element: <Calender></Calender>,
      },
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

function Layout() {
  const navigation = useNavigation();
  const linkList = router.routes[0].children?.filter(
    (item) => item.path !== "*" && item.id !== "home"
  ) as RouteObject[];
  return (
    <div>
      {navigation.state !== "idle" && (
        <div className="fixed bg-slate-300  w-full h-full text-black grid place-items-center">
          <div className="text-3xl">Loading...</div>
        </div>
      )}

      <nav>
        <ul className="flex gap-4 p-4">
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

function Home() {
  return (
    <div>
      <h2>Home</h2>
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
          ? `bg-slate-500 ${linkBaseClass} ${props.className ?? ""}`
          : isActive
          ? `bg-red-200 ${linkBaseClass} ${props.className ?? ""}`
          : `bg-slate-200 ${linkBaseClass} ${props.className ?? ""}`;
      }}
      to={props.to}
    >
      {props?.children}
    </NavLink>
  );
}
