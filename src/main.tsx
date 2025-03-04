import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { ChatProvider } from "./context/ChatContext";
import "./index.css";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

const CHAINLIT_SERVER = "http://localhost:80/chainlit";

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "webapp");

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ChainlitContext.Provider value={apiClient}>
    <RecoilRoot>
      <ChatProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatProvider>
    </RecoilRoot>
  </ChainlitContext.Provider>
  // </React.StrictMode>
);
