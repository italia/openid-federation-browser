import style from "../css/ContextMenu.module.css";
import { IconAtom } from "./Icon";
import { FormattedMessage } from "react-intl";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  validateEntityConfiguration,
  validateSubordinateStatement,
} from "../lib/openid-federation/schema";
import { useState } from "react";

type SchemaValidity = "UNKNOWN" | "VALID" | "INVALID";

export interface ECViewerProps {
  raw: string;
  decodedPayload: { [key: string]: string };
  decodedHeader: { [key: string]: string };
  validationFn?: (payload: any) => Promise<boolean>;
}

export const JWTViewer = ({
  raw,
  decodedPayload,
  decodedHeader,
  validationFn,
}: ECViewerProps) => {
  const decodedPayloadStr = JSON.stringify(decodedPayload, null, 4);
  const decodedHeaderStr = JSON.stringify(decodedHeader, null, 4);

  const [schemaValidity, setSchemaValidity] =
    useState<SchemaValidity>("UNKNOWN");

  const validateSchema = async () => {
    if (!validationFn) return;

    const result = await validationFn(decodedPayload);

    if (result) {
      setSchemaValidity("VALID");
    } else {
      setSchemaValidity("INVALID");
    }
  };

  return (
    <div className="container" style={{ width: "100%", padding: "14px 24px" }}>
      <div className="row" style={{ padding: "8px" }}>
        {validationFn && (
          <table style={{ width: "100%" }}>
            <tr>
              <td>
                <button
                  className="btn btn-primary btn-icon btn-xs py-1 px-1"
                  title="Discovery"
                  aria-label="Discovery"
                  onClick={validateSchema}
                  disabled={schemaValidity !== "UNKNOWN"}
                >
                  <IconAtom
                    iconID="#it-check"
                    className="icon-xs icon-white"
                    isRounded={false}
                  />
                  <span className={style.contextAccordinButton}>Validate</span>
                </button>
              </td>
              <td>
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
            </tr>
          </table>
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
        <div className="col-md-auto">
          <ul className="nav nav-tabs auto">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="nav-header-tab"
                data-bs-toggle="tab"
                href="#nav-header"
                role="tab"
                aria-controls="nav-header"
                aria-selected="true"
              >
                <span className={style.contextAccordinText}>
                  <FormattedMessage id="header" />
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="nav-payload-tab"
                data-bs-toggle="tab"
                href="#nav-payload"
                role="tab"
                aria-controls="nav-payload"
                aria-selected="false"
              >
                <span className={style.contextAccordinText}>
                  <FormattedMessage id="payload" />
                </span>
              </a>
            </li>
          </ul>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-header"
              role="tabpanel"
              aria-labelledby="nav-header-tab"
            >
              <SyntaxHighlighter language="json" style={oneLight}>
                {decodedHeaderStr}
              </SyntaxHighlighter>
            </div>
            <div
              className="tab-pane fade"
              id="nav-payload"
              role="tabpanel"
              aria-labelledby="nav-payload-tab"
            >
              <SyntaxHighlighter language="json" style={oneLight}>
                {decodedPayloadStr}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
