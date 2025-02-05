import React from "react";
import { useNavigate } from "react-router-dom";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { IconAtom } from "../atoms/Icon";
import { getSessionsList, restoreSession } from "../lib/utils";
import { deleteSession } from "../lib/utils";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "../atoms/ViewImport";
import { timestampToLocaleString } from "../lib/utils";
import { Session } from "../lib/types";
import bodyStyle from "../css/BodyComponent.module.css";
import style from "../css/ContextMenu.module.css";

export const RestoreView = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(getSessionsList());

  const toggleTab = (tab: string) => {
    const show = tab === "file" ? "file" : "previous";
    const hide = tab === "file" ? "previous" : "file";

    const showElement = document.getElementById(`nav-${show}`);
    if (showElement) {
      showElement.classList.add("active");
      showElement.classList.add("show");
    }

    const showElementTab = document.getElementById(`nav-${show}-tab`);
    if (showElementTab) {
      showElementTab.classList.add("active");
    }

    const hideElement = document.getElementById(`nav-${hide}`);
    if (hideElement) {
      hideElement.classList.remove("active");
      hideElement.classList.remove("show");
    }

    const hideElementTab = document.getElementById(`nav-${hide}-tab`);
    if (hideElementTab) {
      hideElementTab.classList.remove("active");
    }
  };

  const ItemsRenderer = ({ items }: { items: Session[] }) => {
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
                <th style={{ width: "162px" }}>
                  <div className="row justify-content-center">
                    <img
                      src={d.screenShot}
                      style={{ width: "160px", height: "60px" }}
                      alt="screenshot"
                    />
                  </div>
                </th>
                <th style={{ width: "280px" }}>
                  <div
                    className={`row justify-content-center ${style.contextAccordinText}`}
                  >
                    {d.label}
                  </div>
                </th>
                <th style={{ width: "160px" }}>
                  <div
                    className={`row justify-content-center ${style.contextAccordinText}`}
                  >
                    {timestampToLocaleString(d.date)}
                  </div>
                </th>
                <th style={{ width: "90px" }}>
                  <div className="row justify-content-center">
                    <button
                      className={`btn btn-icon btn-sm py-0 px-1 btn-success`}
                      title="Load"
                      aria-label="Load"
                      style={{ width: "90px" }}
                      onClick={() => {
                        restoreSession(d.sessionName);
                        navigate("/graphView", { replace: true });
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
    <div className={bodyStyle.bodyElement}>
      <ul className="nav nav-tabs auto">
        <li className="nav-item">
          <span
            className="nav-link active"
            id={`nav-file-tab`}
            role="tab"
            onClick={() => toggleTab("file")}
          >
            <span className={style.contextAccordinText}>
              <FormattedMessage id="from_file" />
            </span>
          </span>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id={`nav-previous-tab`}
            role="tab"
            onClick={() => toggleTab("previous")}
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
          id={`nav-file`}
          role="tabpanel"
          aria-labelledby="nav-file-tab"
          style={{ width: "100%" }}
        >
          <div className="row">
            <ViewImportAtom />
          </div>
        </div>
        <div
          className="tab-pane fade"
          id={`nav-previous`}
          role="tabpanel"
          aria-labelledby="nav-previous-tab"
          style={{ width: "100%" }}
        >
          {sessions.length === 0 ? (
            <h6>
              <FormattedMessage id="no_session_available" />
            </h6>
          ) : (
            <PaginatedListAtom
              itemsPerPage={5}
              items={sessions}
              ItemsRenderer={ItemsRenderer}
              filterFn={undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};
