import { AccordionAtom } from "./Accordion";
import style from "../css/ContextMenu.module.css";
import { IconAtom } from "./Icon";
import { FormattedMessage } from "react-intl";

export interface ECViewerProps {
  raw: string;
  decodedPayload: { [key: string]: string };
  decodedHeader: { [key: string]: string };
}

export const JWTViewer = ({
  raw,
  decodedPayload,
  decodedHeader,
}: ECViewerProps) => {
  const decodedPayloadStr = JSON.stringify(decodedPayload, null, 4);
  const decodedHeaderStr = JSON.stringify(decodedHeader, null, 4);

  return (
    <div className="container" style={{ width: "100%", padding: "14px 24px" }}>
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
          className="tab-pane p-4 fade show active"
          id="nav-header"
          role="tabpanel"
          aria-labelledby="nav-header-tab"
        >
          <textarea
            className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
            value={decodedHeaderStr}
            style={{ height: "8rem" }}
            readOnly
          ></textarea>
        </div>
        <div
          className="tab-pane p-4 fade"
          id="nav-payload"
          role="tabpanel"
          aria-labelledby="nav-payload-tab"
        >
          <textarea
            className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
            value={decodedPayloadStr}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};
