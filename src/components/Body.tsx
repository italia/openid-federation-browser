import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UrlInputAtom } from "../atoms/UrlInput";
import { GraphViewComponent } from "./GraphView";
import styles from "../css/BodyComponent.module.css";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "../atoms/ViewImport";
import trustChainList from "../assets/trustChainList.json";
import { AnchorListItemRendererAtom } from "../atoms/AnchorListItemRenderer";
import { SessionListItemRendererAtom } from "../atoms/SessionListItemRenderer";

export const BodyComponent = () => {
  const [searchParams] = useSearchParams();
  const [currentComponent, setCurrentComponent] = useState<string>("InputAtom");
  const [corsEnabled, setCorsEnabled] = useState(false);

  useEffect(() => {
    if (searchParams.has("listUrl")) {
      setCurrentComponent("ListComponent");
    } else if (searchParams.has("viewUpload")) {
      setCurrentComponent("ViewImportComponent");
    } else if (searchParams.has("graphView")) {
      setCurrentComponent("GraphView");
    } else if (searchParams.has("restoreSession")) {
      setCurrentComponent("PreviousSessionItemsRenderer");
    } else {
      setCurrentComponent("InputAtom");
    }
  }, [searchParams]);

  useEffect(() => {
    if (trustChainList.length) {
      const testUrl =
        process.env.REACT_APP_CORS_PROXY ||
        "" + trustChainList[0].url + "/.well-known/openid-federation";

      axios.get(testUrl).catch((e) => {
        if (e.request.status === 0) setCorsEnabled(true);
      });
    }
  });

  return (
    <>
      {corsEnabled && (
        <div
          className="alert alert-warning"
          role="alert"
          style={{ fontSize: "14px" }}
        >
          <FormattedMessage id="cors_warning" />
          <a
            href={process.env.REACT_APP_CORS_DOCS_URL || "/"}
            className="alert-link"
            style={{ marginLeft: "10px" }}
          >
            <FormattedMessage id="read_more" />
          </a>
        </div>
      )}
      <div className={styles.bodyContainer}>
        {currentComponent === "ListComponent" ? (
          <div className={styles.bodyElement}>
            <AnchorListItemRendererAtom />
          </div>
        ) : currentComponent === "ViewImportComponent" ? (
          <div className={styles.bodyElement}>
            <ViewImportAtom />
          </div>
        ) : currentComponent === "GraphView" ? (
          <GraphViewComponent />
        ) : currentComponent === "PreviousSessionItemsRenderer" ? (
          <div className={styles.bodyElement}>
            <SessionListItemRendererAtom />
          </div>
        ) : (
          <div className={styles.bodyElement}>
            <UrlInputAtom />
          </div>
        )}
      </div>
    </>
  );
};
