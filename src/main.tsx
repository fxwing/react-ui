import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ClickToComponent } from "click-to-react-component";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
    <App />
    <ClickToComponent></ClickToComponent>
  </>
  // </React.StrictMode>,
);
