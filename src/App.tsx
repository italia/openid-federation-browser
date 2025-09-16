import "./App.css";
import React from "react";
import { IntlProvider } from "react-intl";
import { getTranslations } from "./lib/translations";
import { Header } from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";
import trustChainList from "./assets/trustAnchorsList.json";
import axios from "axios";
import { UrlInput } from "./components/UrlInput";
import { AnchorList } from "./components/AnchorList";
import { RestoreView } from "./components/RestoreView";
import { GraphView } from "./components/GraphView";
import bodyStyle from "./css/BodyComponent.module.css";

const App = () => {
  const [corsEnabled, setCorsEnabled] = useState(false);

  useEffect(() => {
    if (trustChainList.length) {
      const testUrl =
        (import.meta.env.VITE_CORS_PROXY || "") +
        trustChainList[0].url +
        "/.well-known/openid-federation";

      axios.get(testUrl).catch((e) => {
        if (e.request.status === 0) setCorsEnabled(true);
      });
    }
  });

  return (
    <div className="App">
      <IntlProvider
        locale={navigator.language.split(",")[0]}
        defaultLocale="en-EN"
        messages={getTranslations(navigator.language)}
      >
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
          <Header />
          {corsEnabled && (
            <div
              className="alert alert-warning"
              role="alert"
              style={{ fontSize: "14px" }}
            >
              <FormattedMessage id="cors_warning" />
              <a
                href={`${import.meta.env.VITE_CORS_DOCS_URL}` || "/"}
                className="alert-link"
                style={{ marginLeft: "10px" }}
              >
                <FormattedMessage id="read_more" />
              </a>
            </div>
          )}

          <div className={bodyStyle.bodyContainer}>
            <Routes>
              <Route path="/" Component={UrlInput} />
              <Route path="/insertUrl" Component={UrlInput} />
              <Route path="/listUrl" Component={AnchorList} />
              <Route path="/restoreSession" Component={RestoreView} />
              <Route path="/insertEntityUrl" Component={UrlInput} />
              <Route path="/graphView" Component={GraphView} />
            </Routes>
          </div>
        </BrowserRouter>
        <canvas id="canvas" style={{ display: "none" }}></canvas>
      </IntlProvider>
    </div>
  );
};

export default App;
