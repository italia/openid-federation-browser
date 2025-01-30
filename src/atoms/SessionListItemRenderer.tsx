import { useSearchParams } from "react-router-dom";
import { PaginatedListAtom } from "./PaginatedList";
import { IconAtom } from "./Icon";
import { getSessionsList, restoreSession } from "../lib/utils";
import { deleteSession } from "../lib/utils";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "./ViewImport";
import { timestampToLocaleString } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export const SessionListItemRendererAtom = () => {
  const [, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<any[]>(getSessionsList());

  const ItemsRenderer = ({ items }: { items: any[] }) => {
    return (
      <table style={{ listStyleType: "none", width: "100%" }}>
        <thead>
          <tr className={`primary-bg ${style.contextHeaderText}`}>
            <th>
              <div className={`row justify-content-center`}>
                  <FormattedMessage id="screenshot" />
              </div>
            </th>
            <th>
              <div className={`row justify-content-center`}>
                  <FormattedMessage id="session_name" />
              </div>
            </th>
            <th>
              <div className={`row justify-content-center`}>
                  <FormattedMessage id="date" />
              </div>
            </th>
            <th>
              <div className={`row justify-content-center`}>
                  <FormattedMessage id="actions" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map((d) => (
              <tr key={d.sessionName}>
                <th style={{width: "162px"}}>
                  <div className="row justify-content-center">
                    <img
                      src={d.screenShot}
                      style={{ width: "160px", height: "60px" }}
                      alt="screenshot"
                    />
                  </div>
                </th>
                <th style={{width: "280px"}}>
                  <div
                    className={`row justify-content-center ${style.contextAccordinText}`}
                  >
                    {d.label}
                  </div>
                </th>
                <th style={{width: "160px"}}>
                  <div
                    className={`row justify-content-center ${style.contextAccordinText}`}
                  >
                    {timestampToLocaleString(d.date)}
                  </div>
                </th>
                <th style={{width: "90px"}}>
                  <div className="row justify-content-center">
                    <button
                      className={`btn btn-icon btn-sm py-0 px-1 btn-success`}
                      title="Load"
                      aria-label="Load"
                      style={{ width: "90px" }}
                      onClick={() => {
                        restoreSession(d.sessionName);
                        setSearchParams({ graphView: "" });
                      }}
                    >
                      <IconAtom
                        iconID="#it-plus"
                        className="icon-xs icon-white"
                        isRounded={false}
                      />
                      <span className={style.contextAccordinButton}>
                        Restore
                      </span>
                    </button>
                  </div>
                  <div className="row justify-content-center mt-1">
                    <button
                      className={`btn btn-icon btn-sm py-0 px-1 btn-danger`}
                      title="Delete"
                      aria-label="Delete"
                      style={{ width: "90px" }}
                      onClick={() => {
                        deleteSession(d.sessionName);
                        setSessions([...getSessionsList()]);
                      }}
                    >
                      <IconAtom
                        iconID="#it-minus"
                        className="icon-xs icon-white"
                        isRounded={false}
                      />
                      <span className={style.contextAccordinButton}>
                        Delete
                      </span>
                    </button>
                  </div>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <ul className="nav nav-tabs auto">
        <li className="nav-item">
          <a
            className="nav-link active"
            id={`nav-header-tab`}
            data-bs-toggle="tab"
            href={`#nav-header`}
            role="tab"
            aria-controls={`nav-header`}
            aria-selected="true"
          >
            <span className={style.contextAccordinText}>
              <FormattedMessage id="from_file" />
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id={`nav-payload-tab`}
            data-bs-toggle="tab"
            href={`#nav-payload`}
            role="tab"
            aria-controls={`nav-payload`}
            aria-selected="false"
          >
            <span className={style.contextAccordinText}>
              <FormattedMessage id="from_previous_session" />
            </span>
          </a>
        </li>
      </ul>
      <div
        className="tab-content"
        id="nav-tabContent"
        style={{ marginTop: "40px" }}
      >
        <div
          className="tab-pane fade show active"
          id={`nav-header`}
          role="tabpanel"
          aria-labelledby="nav-header-tab"
          style={{ width: "100%" }}
        >
          <div className="row">
            <ViewImportAtom />
          </div>
        </div>
        <div
          className="tab-pane fade"
          id={`nav-payload`}
          role="tabpanel"
          aria-labelledby="nav-payload-tab"
          style={{ width: "100%" }}
        >
          {sessions.length === 0 ? (
            <div>
              <h6>
                <FormattedMessage id="no_session_available" />
              </h6>
            </div>
          ) : (
            <>
              <PaginatedListAtom
                itemsPerPage={5}
                items={sessions}
                ItemsRenderer={ItemsRenderer}
                filterFn={undefined}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
