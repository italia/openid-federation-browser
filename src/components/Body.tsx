import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UrlInputAtom } from "../atoms/UrlInput";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { GraphViewComponent } from "./GraphView";
import styles from "../css/BodyComponent.module.css";
import trustChainList from "../assets/trustChainList.json";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "../atoms/ViewImport";
import { getSessionsList, restoreSession } from "../lib/utils";

export const BodyComponent = () => {
  const [currentComponent, setCurrentComponent] = useState<string>("InputAtom");
  const [searchParams, setSearchParams] = useSearchParams();
  const [corsEnabled, setCorsEnabled] = useState(false);

  const ItemsRenderer = ({ items }: { items: any[] }) => {
    return (
      <ul>
        {items &&
          items.map((d) => (
            <li key={d.url}>
              <a
                style={{ fontSize: "14px" }}
                onClick={() => {
                  sessionStorage.setItem(
                    "trustAnchorUrl",
                    JSON.stringify({ url: d.url, searchType: "anchor" }),
                  );
                  sessionStorage.removeItem("currentSession");
                  sessionStorage.removeItem("currentSessionName");
                  window.dispatchEvent(new Event("trustAnchorUrl"));
                  setSearchParams({ graphView: "" });
                }}
              >
                {d.name} - {d.url}
              </a>
            </li>
          ))}
      </ul>
    );
  };

  const PreviousSessionItemsRenderer = ({ items }: { items: any[] }) => {
    return (
      <ul>
        {getSessionsList().map((d) => (
          <li key={d.sessionName}>
            <a
              style={{ fontSize: "14px" }}
              onClick={() => {
                restoreSession(d.sessionName);
                setSearchParams({ graphView: "" });
              }}
            >
              {d.label}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const trustAnchorFilter = (anchor: any, filterValue: string) =>
    anchor.name.toLowerCase().includes(filterValue.toLowerCase());

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
            <PaginatedListAtom
              itemsPerPage={5}
              items={trustChainList}
              ItemsRenderer={ItemsRenderer}
              filterFn={trustAnchorFilter}
            />
          </div>
        ) : currentComponent === "ViewImportComponent" ? (
          <div className={styles.bodyElement}>
            <ViewImportAtom />
          </div>
        ) : currentComponent === "GraphView" ? (
          <GraphViewComponent />
        ) : currentComponent === "PreviousSessionItemsRenderer" ? (
          <div className={styles.bodyElement}>
            <PaginatedListAtom
              itemsPerPage={5}
              items={getSessionsList()}
              ItemsRenderer={PreviousSessionItemsRenderer}
              filterFn={undefined}
            />
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
