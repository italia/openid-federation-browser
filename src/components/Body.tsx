import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UrlInputAtom } from "../atoms/UrlInput";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { Link } from "react-router-dom";
import { isValidUrl } from "../lib/utils";
import { GraphViewComponent } from "./GraphView";
import styles from "../css/BodyComponent.module.css";
import trustChainList from "../assets/trustChainList.json";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "../atoms/ViewImport";

export const BodyComponent = () => {
  const [importedView, setImportedView] = useState<string | undefined>(
    undefined,
  );
  const [trustAnchorUrl, setTrustAnchorUrl] = useState<string | undefined>(
    undefined,
  );

  const ItemsRenderer = ({ items }: { items: any[] }) => {
    return (
      <ul>
        {items &&
          items.map((d) => (
            <li key={d.url}>
              <Link to={`/?trustAnchorUrl=${d.url}`}>
                {d.name} - {d.url}
              </Link>
            </li>
          ))}
      </ul>
    );
  };

  const trustAnchorFilter = (anchor: any, filterValue: string) =>
    anchor.name.toLowerCase().includes(filterValue.toLowerCase());

  const conponents = {
    InputAtom: (
      <div className={styles.bodyElement}>
        <UrlInputAtom validationFn={isValidUrl} />
      </div>
    ),
    TrstAnchorListAtom: (
      <div className={styles.bodyElement}>
        <PaginatedListAtom
          itemsPerPage={5}
          items={trustChainList}
          ItemsRenderer={ItemsRenderer}
          filterFn={trustAnchorFilter}
        />
      </div>
    ),
    ViewImport: (
      <div className={styles.bodyElement}>
        <ViewImportAtom onFileUpload={setImportedView} />
      </div>
    ),
    GraphView: <GraphViewComponent view={importedView} url={trustAnchorUrl} />,
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [visualizedAtom, setVisualizedAtom] = useState<JSX.Element>(
    conponents["InputAtom"],
  );

  const [corsEnabled, setCorsEnabled] = useState(false);

  useEffect(() => {
    if (searchParams.has("graphView")) {
      return;
    }

    if (searchParams.has("trustAnchorUrl")) {
      setTrustAnchorUrl(searchParams.get("trustAnchorUrl") as string);
      return;
    }

    setImportedView(undefined);
    setTrustAnchorUrl(undefined);

    if (searchParams.has("listUrl")) {
      setVisualizedAtom(conponents["TrstAnchorListAtom"]);
    } else if (searchParams.has("viewUpload")) {
      setVisualizedAtom(conponents["ViewImport"]);
    } else {
      setVisualizedAtom(conponents["InputAtom"]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (trustAnchorUrl || importedView) {
      setSearchParams({ graphView: "" });
      setVisualizedAtom(conponents["GraphView"]);
    }
  }, [trustAnchorUrl, importedView]);

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
      <div className={styles.bodyContainer}>{visualizedAtom}</div>
    </>
  );
};
