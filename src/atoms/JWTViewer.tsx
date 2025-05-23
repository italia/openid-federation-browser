import React, { useEffect } from "react";
import style from "../css/ContextMenu.module.css";
import { IconAtom } from "./Icon";
import { FormattedMessage } from "react-intl";
import { CodeViewer } from "./CodeViewer";
import { useState } from "react";

type SchemaValidity = "UNKNOWN" | "VALID" | "INVALID";

export interface ECViewerProps {
  id: string;
  raw: string;
  decodedPayload: object;
  decodedHeader: object;
  validationFn?: (payload: object) => Promise<[boolean, string | undefined]>;
  schemaUrl?: string;
}

export const JWTViewer = ({
  id,
  raw,
  decodedPayload,
  decodedHeader,
  validationFn,
  schemaUrl,
}: ECViewerProps) => {
  const [schemaValidity, setSchemaValidity] =
    useState<SchemaValidity>("UNKNOWN");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const decodedPayloadStr = JSON.stringify(decodedPayload, null, 4);
  const decodedHeaderStr = JSON.stringify(decodedHeader, null, 4);

  const toggleTab = (tab: string) => {
    const show = tab === "header" ? "header" : "payload";
    const hide = tab === "header" ? "payload" : "header";

    const showElement = document.getElementById(`${id}-nav-${show}`);
    if (showElement) {
      showElement.classList.add("active");
      showElement.classList.add("show");
    }

    const showElementTab = document.getElementById(`${id}-nav-${show}-tab`);
    if (showElementTab) {
      showElementTab.classList.add("active");
    }

    const hideElement = document.getElementById(`${id}-nav-${hide}`);
    if (hideElement) {
      hideElement.classList.remove("active");
      hideElement.classList.remove("show");
    }

    const hideElementTab = document.getElementById(`${id}-nav-${hide}-tab`);
    if (hideElementTab) {
      hideElementTab.classList.remove("active");
    }
  };

  useEffect(() => {
    const validateSchema = async () => {
      if (!validationFn) return;

      const [valid, errors] = await validationFn(decodedPayload);

      if (valid) {
        setSchemaValidity("VALID");
      } else {
        setSchemaValidity("INVALID");
        setValidationError(errors);
      }
    };

    if (schemaValidity === "UNKNOWN") {
      validateSchema();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaValidity]);

  return (
    <div className="container" style={{ width: "100%", padding: "14px 24px" }}>
      <div className="row" style={{ padding: "8px" }}>
        {validationFn && (
          <div className="col">
            <table
              style={{ width: "100%" }}
              data-testid="schema-validation-table"
            >
              <tbody>
                <tr>
                  <td>
                    <IconAtom
                      iconID={`${schemaValidity === "VALID" ? "#it-check" : "#it-close"}`}
                      className={`icon-sm ${schemaValidity === "VALID" ? "icon-success" : "icon-danger"}`}
                      isRounded={false}
                    />
                    <span className={style.contextAccordinText}>
                      {schemaValidity === "UNKNOWN" ? (
                        <FormattedMessage id="validate_schema" />
                      ) : schemaValidity === "VALID" ? (
                        <FormattedMessage id="valid_schema" />
                      ) : (
                        <FormattedMessage id="invalid_schema" />
                      )}
                    </span>
                  </td>
                  {schemaUrl && (
                    <td>
                      <a href={schemaUrl} className={style.contextAccordinText}>
                        <FormattedMessage id="schema_validation_url" />
                      </a>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {validationError && (
              <div className="alert alert-danger" role="alert">
                <span className={style.contextAccordinText}>
                  {validationError}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="row" style={{ padding: "8px" }}>
        <div className="col-4">
          <button
            className="btn btn-primary btn-icon btn-xs py-1 px-1"
            title="Discovery"
            aria-label="Discovery"
            onClick={() => navigator.clipboard.writeText(raw)}
            data-testid="copy-raw-jwt-button"
          >
            <IconAtom
              iconID="#it-copy"
              className="icon-xs icon-white"
              isRounded={false}
            />
            <span className={style.contextAccordinButton}>Copy raw JWT</span>
          </button>
        </div>
      </div>
      <div className="row" style={{ padding: "8px" }}>
        <div className="col">
          <ul className="nav nav-tabs auto" data-testid="jwt-tabs">
            <li className="nav-item">
              <span
                data-testid="jwt-header-tab"
                className="nav-link active"
                id={`${id}-nav-header-tab`}
                role="tab"
                onClick={() => toggleTab("header")}
              >
                <span className={style.contextAccordinText}>
                  <FormattedMessage id="header" />
                </span>
              </span>
            </li>
            <li className="nav-item" data-testid="jwt-payload-li">
              <span
                data-testid="jwt-payload-tab"
                className="nav-link"
                id={`${id}-nav-payload-tab`}
                role="tab"
                onClick={() => toggleTab("payload")}
              >
                <span className={style.contextAccordinText}>
                  <FormattedMessage id="payload" />
                </span>
              </span>
            </li>
          </ul>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id={`${id}-nav-header`}
              role="tabpanel"
              aria-labelledby="nav-header-tab"
              data-testid="jwt-header-tab-content"
            >
              <CodeViewer language="json" code={decodedHeaderStr} />
            </div>
            <div
              className="tab-pane fade"
              id={`${id}-nav-payload`}
              role="tabpanel"
              aria-labelledby="nav-payload-tab"
              data-testid="jwt-payload-tab-content"
            >
              <CodeViewer language="json" code={decodedPayloadStr} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
