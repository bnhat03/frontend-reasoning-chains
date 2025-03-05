import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { AppProvider } from "./context/AppContext.tsx";
import "./index.css";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

const CHAINLIT_SERVER = "ws://192.168.91.105:8000/chainlit";

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "webapp");

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ChainlitContext.Provider value={apiClient}>
    <RecoilRoot>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </RecoilRoot>
  </ChainlitContext.Provider>
  // </React.StrictMode>
);
